import { useState } from 'react'

const BlogForm = ({
  createBlog
}) => {
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogUrl, setNewBlogUrl] = useState('')

  const handleBlogTitleChange = (event) => {
    setNewBlogTitle(event.target.value)
  }

  const handleBlogAuthorChange = (event) => {
    setNewBlogAuthor(event.target.value)
  }
  const handleBlogUrlChange = (event) => {
    setNewBlogUrl(event.target.value)
  }

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogUrl
    })
    // Reset blog form values
    setNewBlogTitle('')
    setNewBlogAuthor('')
    setNewBlogUrl('')
  }

  return (
    <form onSubmit={addBlog}>
      <div>
      title
        <input
          value={newBlogTitle}
          onChange={handleBlogTitleChange}
          id='new-blog-title'
        />
      </div>
      <div>
      author
        <input
          value={newBlogAuthor}
          onChange={handleBlogAuthorChange}
          id='new-blog-author'
        />
      </div>
      <div>
      url
        <input
          value={newBlogUrl}
          onChange={handleBlogUrlChange}
          id='new-blog-url'
        />
      </div>
      <button id='submit-new-blog' type="submit">save</button>
    </form>
  )
}

export default BlogForm