const LoginForm = ({
  handleLogin,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password
}) => (
  <form
    className='login-form'
    onSubmit={handleLogin}
  >
    <div>
      username
      <input
        id='username'
        type="text"
        value={username}
        name="Username"
        onChange={handleUsernameChange}
      />
    </div>
    <div>
      password
      <input
        id='password'
        type='password'
        value={password}
        name='Password'
        onChange={handlePasswordChange}
      />
    </div>
    <button
      type="submit"
      id='login-button'
    >login</button>
  </form>
)

export default LoginForm