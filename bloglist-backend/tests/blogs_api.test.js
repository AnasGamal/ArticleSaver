const Blog = require('../models/blog')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const mongoose = require('mongoose')
const User = require('../models/user')
const bcrypt = require('bcrypt')

describe('when there is initially some blogs saved', () => {
    var token;
    var user;
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        user = new User({ username: 'root', passwordHash })
    
        await user.save()

        const response = await api.post('/api/login').send({
            username: 'root',
            password: 'sekret'
        })
        token = response.body.token

        await Blog.deleteMany({});
        await Blog.insertMany(helper.getInitialBlogs(user.id));
    });

    test("blogs have id property named id instead of _id", async () => {
        const response = await api.get("/api/blogs");

        const ids = response.body.map((blog) => blog.id);
    
        for (const id of ids) {
            expect(id).toBeDefined();
        }
    }, 10000);

    test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')

        expect(response.body).toHaveLength(helper.getInitialBlogs(user.id).length)
    })

    test('likes are 0 if likes property is missing', async () => {

        const newBlog = {
          title: 'Any Title',
          author: 'Person',
          url: 'test-url',
        }
      
        const response = await api
          .post('/api/blogs')
          .set('Authorization', `Bearer ${token}`)
          .send(newBlog)
          .expect(201)
          .expect('Content-Type', /application\/json/)
      
        expect(response.body.likes).toBe(0)
      })

  describe('viewing a specific blog', () => {

    test('succeeds with a valid id', async () => {
      const blogsAtStart = await helper.blogsInDb()

      const blogToView = blogsAtStart[0]

      const resultBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(resultBlog.body.id).toEqual(blogToView.id)
    })

    test('fails with statuscode 404 if blog does not exist', async () => {
      const validNonexistingId = await helper.nonExistingId()

      console.log(validNonexistingId)

      await api
        .get(`/api/blogs/${validNonexistingId}`)
        .expect(404)
    })

    test('fails with statuscode 400 id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'

      await api
        .get(`/api/blogs/${invalidId}`)
        .expect(400)
    })
  })

  describe('addition of a new blog', () => {
    test('succeeds with valid data', async () => {
      const newBlog = {
        title: "Succeeded",
        author: "Robert C. Martin",
        url: "it-works",
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.getInitialBlogs(user.id).length + 1)

      const urls = blogsAtEnd.map(b => b.url)
      expect(urls).toContain(
        'it-works'
      )
    })

    test('fails with status code 400 if data invalid', async () => {
      const newBlog = {
        author: "Robert C. Martin",
        likes: 5
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(helper.getInitialBlogs(user.id).length)
    })
  })

  describe('modify existing blog', () => {
    test('succeeds with valid data', async () => {
      const updatedUrl = 'edited'
      const editedBlog = {
        url: updatedUrl
      }
      // blog id in paramters is from test_helper.js, we always begin with data there
      const response = await api
        .put('/api/blogs/5a422b3a1b54a676234d17f9')
        .set('Authorization', `Bearer ${token}`)
        .send(editedBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(response.body.url).toBe(updatedUrl)
    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(
        helper.getInitialBlogs(user.id).length - 1
      )

      const urls = blogsAtEnd.map(r => r.url)

      expect(urls).not.toContain(blogToDelete.url)
    })
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})