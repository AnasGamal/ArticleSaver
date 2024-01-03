import { useState, useEffect } from "react";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import Togglable from "./components/Togglable";
import BlogForm from "./components/BlogForm";
import { setNotification } from "./reducers/notificationReducer";
import { setUser } from "./reducers/userReducer";
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { useQuery , useMutation, useQueryClient } from '@tanstack/react-query'
import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom'
import Users from "./components/Users";
import User from "./components/User";
import userService from "./services/users";
import Blog from "./components/Blog";
import Blogs from "./components/Blogs";
import { Container } from '@mui/material'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material'
import Navbar from "./components/Navbar";
import "./index.css";

const App = () => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)

  const [users, setUsers] = useState([]);

  useEffect(() => {
      const fetchUsers = async () => {
          const response = await userService.getAll();
          setUsers(response);
      };
      fetchUsers();
  }, []);

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogappUser");
    dispatch(setUser(null));
  };

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch(setUser(user));
      blogService.setToken(user.token);
    }
  }, []);

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
  })

  const blogs = result.data

 
  
  const padding = {
    padding: 5
  }

  return (
    <Container>
    <Router>
      <Navbar />
    <div>
      <Notification />
      <h2>ArticleSaver</h2>
      {user && (
        <div>
          

          <Togglable buttonLabel="save article">
            <BlogForm />
          </Togglable>
        </div>
      )}
      
        <Routes>
        <Route
          path="/"
          element={
            result.isLoading ? (
              <div>Loading...</div>
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableBody>
                    {blogs
                      .sort((a, b) => b.likes - a.likes)
                      .map((blog) => (
                        <Blogs key={blog.id} blog={blog} user={user} />
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )
          }
        />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/users" element={<Users users={users} />} />
      <Route path="/blogs/:id" element={<Blog blogs={blogs} />} />
      <Route path="/users/:id" element={<User users={users} />} />
      </Routes>
    </div>
    </Router>
    </Container>
  );
};

export default App;
