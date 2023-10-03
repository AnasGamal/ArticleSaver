const listHelper = require('../utils/list_helper')
const { initialBlogs, listWithOneBlog }  = require('./test_helper')

describe('Statistics', () => {


test('blogs return favorite blog', () => {
  const result = listHelper.favoriteBlog(initialBlogs)
  expect(result).toBe(12)
})

test('blogs return total likes', () => {
  const result = listHelper.totalLikes(initialBlogs)
  expect(result).toBe(36)
})
test('when list has only one blog, equals the likes of that', () => {
  const result = listHelper.totalLikes(listWithOneBlog)
  expect(result).toBe(5)
})
test('author with most blogs', () => {
  const result = listHelper.mostBlogs(initialBlogs)
  expect(result).toStrictEqual({
    author: "Robert C. Martin",
    blogs: 3
  })
})

test('author with most likes', () => {
  const result = listHelper.mostLikes(initialBlogs)
  expect(result).toStrictEqual({
    author: "Edsger W. Dijkstra",
    likes: 12
  })
})
})