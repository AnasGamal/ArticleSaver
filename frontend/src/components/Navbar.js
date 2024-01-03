import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AppBar, Toolbar, IconButton, Button } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { setUser } from '../reducers/userReducer';
import { setNotification } from '../reducers/notificationReducer';

const Navbar = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const handleLogout = () => {
        window.localStorage.removeItem('loggedBlogappUser');
        dispatch(setUser(null));
    };
    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton edge="start" color="inherit" aria-label="menu">
                </IconButton>
                <Button color="inherit" component={Link} to="/">
                    blogs
                </Button>
                <Button color="inherit" component={Link} to="/users">
                    users
                </Button>
                {user ? (
                    <div>
                        <em>{user.name} logged in</em>
                        <Button color="inherit" onClick={handleLogout}>
                            logout
                        </Button>
                    </div>
                ) : (
                    <Button color="inherit" component={Link} to="/login">
                        login
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;