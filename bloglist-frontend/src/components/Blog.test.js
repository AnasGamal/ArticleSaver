import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'

const blog = {
  title: 'Component testing is done with react-testing-library',
  user: {
    name: 'User'
  },
  url: 'url-string',
  likes: 15
}

test('Blog renders title', () => {
  // mock <Blog> component render
  const { container } = render(<Blog blog={blog} />)

  const blogDiv = container.querySelector('.blog')
  expect(blogDiv).toHaveTextContent(
    'Component testing is done with react-testing-library'
  )
})

test('Blog renders user after clicking view', async () => {
  // mock <Blog> component render
  const { container } = render(<Blog blog={blog} />)
  const user = userEvent.setup()
  // find toggle button html element by its label text
  const button = screen.getByText('view')
  // mock toggle button click
  await user.click(button)
  // find html element that renders user name
  const blogUserP = container.querySelector('.blogUser')
  expect(blogUserP).toHaveTextContent(
    'User'
  )
})

test('Blog does not render author and url by default', () => {
  // mock <Blog> component render
  const { container } = render(<Blog blog={blog} />)
  const blogLikes = container.querySelector('.blogLikes')
  expect(blogLikes).toBeNull()
  const blogUrl = container.querySelector('.blogUrl')
  expect(blogUrl).toBeNull()
})

test('Blog renders author and url after clicking view', async () => {
  // mock <Blog> component render
  const { container } = render(<Blog blog={blog} />)
  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)
  const blogLikes = container.querySelector('.blogLikes')
  expect(blogLikes).toHaveTextContent(
    15
  )
  const blogUrl = container.querySelector('.blogUrl')
  expect(blogUrl).toHaveTextContent(
    'url-string'
  )
})

test('Blog like button event handler is called twice when pressed twice', async () => {
  const mockLikeButtonHandler = jest.fn()
  // mock <Blog> component render
  render(<Blog blog={blog} handleLikeClick={mockLikeButtonHandler} />)
  const user = userEvent.setup()
  // find view button and click it once
  const viewButton = screen.getByText('view')
  await user.click(viewButton)
  // find like button and clicke it twice
  const likeButton = screen.getByText('like')
  // mock clicking on like button twice
  await user.click(likeButton)
  await user.click(likeButton)
  // expect event handler mock function to be called twice
  expect(mockLikeButtonHandler.mock.calls).toHaveLength(2)
})