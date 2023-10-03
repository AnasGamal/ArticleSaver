import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> calls event handler to create a blog with right values', async () => {
  const createBlog = jest.fn()
  const user = userEvent.setup()

  // mock BlogForm rendering
  const { container } = render(<BlogForm createBlog={createBlog} />)
  // find form input fields html elements by ids
  const inputBlogTitle = container.querySelector('#new-blog-title')
  const inputBlogAuthor = container.querySelector('#new-blog-author')
  const inputBlogUrl = container.querySelector('#new-blog-url')
  // find form submit button by id
  const sendButton = container.querySelector('#submit-new-blog')
  // mock user typing in form input fields
  await user.type(inputBlogTitle, 'Title')
  await user.type(inputBlogAuthor, 'Author')
  await user.type(inputBlogUrl, 'url')
  // mock press form submittion button
  await user.click(sendButton)
  // event handler function is expected to be called once,
  // since submit button is mocked to be clicked once
  expect(createBlog.mock.calls).toHaveLength(1)
  // event handler function is called with object content that contains user input values
  expect(createBlog.mock.calls[0][0].title).toBe('Title')
  expect(createBlog.mock.calls[0][0].author).toBe('Author')
  expect(createBlog.mock.calls[0][0].url).toBe('url')
})