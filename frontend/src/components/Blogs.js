import { useState } from "react";
import blogService from "../services/blogs";
import { useDispatch } from "react-redux";
import { setNotification } from "../reducers/notificationReducer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from 'react-router-dom'
import { TableRow, TableCell } from '@mui/material'

const Blogs = ({ blog, user }) => {
  const dispatch = useDispatch();
  const [detailsVisible, setdetailsVisible] = useState(false);
  const showWhenVisible = { display: detailsVisible ? "" : "none" };

  const handleViewBlog = () => {
    setdetailsVisible(!detailsVisible);
  };
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  
  const queryClient = useQueryClient()

  const likeBlogMutation = useMutation({
    mutationFn: (blogObject) => blogService.update(blog.id, blogObject),
    onSuccess: () => {
      queryClient.invalidateQueries('blogs');
    },
  });

  const handleLikeClick = async (blog) => {
    await likeBlogMutation.mutateAsync({
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id,
    });
    dispatch(setNotification(`Blog ${blog.title} by ${blog.author} liked.`, "success", 10));
  };

  const removeBlogMutation = useMutation({
    mutationFn: (blogObject) => blogService.remove(blog.id),
    onSuccess: () => {
      queryClient.invalidateQueries('blogs');
    },
  });
  
  const handleRemoveClick = (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      removeBlogMutation.mutateAsync(blog)
        .then(() => {
          dispatch(setNotification(`Blog ${blog.title} by ${blog.author} removed.`, "success", 10));
        })
        .catch((error) => {
          if (error.response.status === 401) {
            dispatch(setNotification("You are not authorized to remove this blog.", "error", 10));
          }
        });
    }
  };


  console.log(blog)
  return (
    <TableRow key={blog.id}>
      <TableCell>
        <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
      </TableCell>
      <TableCell>
        {blog.author}
      </TableCell>
    </TableRow>
  );
};

export default Blogs;
