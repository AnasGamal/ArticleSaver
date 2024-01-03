import { Button, TextField } from '@mui/material'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setUser } from '../reducers/userReducer'
import { setNotification } from '../reducers/notificationReducer'
import loginService from '../services/login'
import blogService from '../services/blogs'
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'
const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const user = useSelector(state => state.user)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const id = useParams().id;
  if (user) {
    navigate(`/`);
  }
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      dispatch(setUser(user));
      setUsername("");
      setPassword("");
      dispatch(setNotification(`Successfully logged in as ${user.name}`, "success", 3));
      console.log("logged in");
    } catch (exception) {
      dispatch(setNotification("Wrong credentials", "error"))
      
      console.log("wrong credentials");
    }
    console.log("logging in with", username, password);
  };

  return (
  <form className="login-form" onSubmit={handleLogin}>
    <div>
      <TextField
        id="username"
        label="username"
        value={username}
        onChange={handleUsernameChange}
      />
    </div>
    <div>
     <TextField
        id="password"
        label="password"
        value={password}
        onChange={handlePasswordChange}
      />
    </div>
    <Button variant="contained" color="primary" id="login-button" type="submit">
      login
    </Button>
  </form>
)};

export default LoginForm;
