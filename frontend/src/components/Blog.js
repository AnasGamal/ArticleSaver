import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'
import { useState } from "react";
import blogService from "../services/blogs";
import { useDispatch } from "react-redux";
import { setNotification } from "../reducers/notificationReducer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from 'react-router-dom'
import { Button, TextField } from '@mui/material';
const Blog = ({ blogs }) => {
    if (!blogs) {
        return <div> Loading... </div>
    }
    const user = useSelector(state => state.user)
    const id = useParams().id;
    const blog = blogs?.find((b) => b.id === id);
    const navigate = useNavigate();
    if (!blog) {
        navigate(`/`);
        return
    }

    const dispatch = useDispatch();
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
          .then(() => {
            navigate(`/`);
          })
          .catch((error) => {
            if (error.response.status === 401) {
              dispatch(setNotification("You are not authorized to remove this blog.", "error", 10));
            }
          });
      }
    };

    const addCommentMutation = useMutation({
        mutationFn: (comment) => blogService.addComment(blog.id, comment),
        onSuccess: () => {
          queryClient.invalidateQueries('blogs');
        },
      });

    const handleAddComment = (event) => {
        event.preventDefault();
        const comment = event.target[0].value;
        addCommentMutation.mutateAsync(comment);
        event.target[0].value = "";
    }
  
  
    return (
        <div key={blog?.id}>
            <h2>{blog?.title}</h2>
            <p><Link to={blog?.url}>{blog.url}</Link></p>
            <p>{blog?.likes} likes <Button variant="contained" color="primary" id="like-button" onClick={() => handleLikeClick(blog)}>like</Button></p>
            <p>added by {blog?.user?.username}</p>
            {user?.username === blog?.user?.username && <Button variant="contained" color="primary" id="remove-button" onClick={() => handleRemoveClick(blog)}>remove</Button>}

            <h3>comments</h3>
            <form onSubmit={handleAddComment}>
                <TextField id="comment" label="comment" />
                <Button variant="contained" color="primary" id="add-comment-button" type="submit">
                    add comment
                </Button>
            </form>    
            <ul>
                {blog.comments?.map((comment) => (
                    <li key={comment.id}>{comment}</li>
                ))}
            </ul>
        </div>
    );
};

export default Blog;
