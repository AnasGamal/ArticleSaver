import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import blogService from "../services/blogs";
import { useDispatch } from "react-redux";
import { setNotification } from "../reducers/notificationReducer";
import { TextField, Button } from "@mui/material";
const BlogForm = () => {
  const [newBlogTitle, setNewBlogTitle] = useState("");
  const [newBlogAuthor, setNewBlogAuthor] = useState("");
  const [newBlogUrl, setNewBlogUrl] = useState("");
  const dispatch = useDispatch();

  const queryClient = useQueryClient();
  
  const newBlogMutation = useMutation({
    mutationFn: (blogObject) => blogService.create(blogObject),
    onSuccess: () => {
      queryClient.invalidateQueries('blogs');
    },
  });
  const createBlog = async (blogObject) => {  
    const returnedBlog = await newBlogMutation.mutateAsync(blogObject);
    dispatch(setNotification(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added.`, "success", 10))
  };

  const handleBlogTitleChange = (event) => {
    setNewBlogTitle(event.target.value);
  };

  const handleBlogAuthorChange = (event) => {
    setNewBlogAuthor(event.target.value);
  };
  const handleBlogUrlChange = (event) => {
    setNewBlogUrl(event.target.value);
  };

  const addBlog = (event) => {
    event.preventDefault();
    createBlog({
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogUrl,
    });
    // Reset blog form values
    setNewBlogTitle("");
    setNewBlogAuthor("");
    setNewBlogUrl("");
  };

  return (
    <form onSubmit={addBlog}>
      <div>
        <TextField
          value={newBlogTitle}
          onChange={handleBlogTitleChange}
          id="new-blog-title"
          label="title"
        />
      </div>
      <div>
        <TextField
          value={newBlogAuthor}
          onChange={handleBlogAuthorChange}
          id="new-blog-author"
          label="author"
        />
      </div>
      <div>
       <TextField
          value={newBlogUrl}
          onChange={handleBlogUrlChange}
          id="new-blog-url"
          label="url"
        />
      </div>
      <Button variant="contained" color="primary" id="create-blog-button" type="submit">save</Button>
    </form>
  );
};

export default BlogForm;