const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')

blogsRouter.get('/', (request, response) => {
    Blog
      .find({}).populate('user', { username: 1, name: 1 })
      .then(blogs => {
        response.json(blogs)
      })
  })

blogsRouter.get('/:id', (request, response, next) => {
  Blog.findById(request.params.id)
    .then(blog => {
      if (blog) {
        response.json(blog)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})
  
blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body 
  const { title, url, likes } = request.body
  const user = request.user

  if (!url || !title || typeof url === 'undefined' || typeof title === 'undefined') {
    return response.status(400).end()
  }
    const savedBlog = new Blog ({
      ...body,
      likes: likes || 0,
      user: user.id
    })
    
    savedBlog
      .save()
      .then(result => {
        result.populate('user', { username: 1, name: 1 }).then(result => {
        response.status(201).json(result)
        })
      })
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
  })

  
blogsRouter.delete('/:id', middleware.userExtractor, async (request, response, next) => {
  const user = request.user


  const blogToDelete = await Blog.findById(request.params.id)
  if (!blogToDelete) {
    return response.status(404).json({ error: 'Blog not found' })
  }

  if (blogToDelete.user.toString() !== user.id.toString()) {
    return response.status(401).json({ error: 'Unauthorized: Only the creator can delete the blog' })
  }

  try {
    await Blog.findByIdAndDelete(blogToDelete.id)
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

blogsRouter.put('/:id', (request, response, next) => {
  const { title, author, url, likes, user } = request.body

  const blog = {
    title,
    author,
    url,
    likes,
    user
  }

  Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    .populate("user", { username: 1, name: 1 })
    .then(updatedBlog => {
      response.json(updatedBlog)
    })
    .catch(error => next(error))
})

module.exports = blogsRouter  