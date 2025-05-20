// Navbar.js
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { Link } from 'react-router-dom';
import LoginIcon from '@mui/icons-material/Login';
import { AuthContext } from '../../../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const { authenticated, user } = React.useContext(AuthContext);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar
      style={{
        background: 'linear-gradient(90deg,rgb(83, 96, 113), #111827)', // Dark gradient
        color: 'white',
        padding: '10px 0',
        boxShadow: '0 2px 4px rgba(255, 255, 255, 0.1)',
      }}
      position="static"
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>

          {/* Left Side: Logo + "Paramount" (desktop) or "SMS" (mobile) */}
          <Link className="nav-list" to="/" style={{ textDecoration: 'none' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <img
                src="./images/static/school_management_system.png"
                height="50px"
                width="50px"
                style={{ marginRight: '8px' }}
                alt="School Logo"
              />
              <Typography
                variant="h6"
                sx={{
                  display: { xs: 'none', md: 'flex' },
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '.2rem',
                  color: '#111827', // dark text for white background
                }}
              >
                Paramount
              </Typography>
              <Typography
                variant="h6"
                noWrap
                sx={{
                  display: { xs: 'flex', md: 'none' },
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '.2rem',
                  color: '#111827', // also dark for consistency
                }}
              >
                SMS
              </Typography>
            </Box>
          </Link>


          {/* Spacer */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Right Side: Hamburger Menu (mobile only) */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
          </Box>

          {/* Desktop Buttons */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end', mr: 3 }}>
            {!authenticated && (
              <>
                <Link className="nav-list" to="/login" style={{ textDecoration: 'none' }}>
                  <Button sx={buttonStyle}>
                    <LoginIcon sx={{ mr: 1 }} />
                    Login
                  </Button>
                </Link>
              </>
            )}

            {authenticated && (
              <>
                <Link className="nav-list" to="/logout" style={{ textDecoration: 'none' }}>
                  <Button sx={buttonStyle}>
                    Logout
                  </Button>
                </Link>

                <Link className="nav-list" to={`/${user.role.toLowerCase()}`} style={{ textDecoration: 'none' }}>
                  <Button sx={buttonStyle}>
                    Dashboard
                  </Button>
                </Link>
              </>
            )}

            <Link className="nav-list" to="/entrance" style={{ textDecoration: 'none' }}>
              <Button sx={buttonStyle}>
                <LoginIcon sx={{ mr: 1 }} />
                Entrance
              </Button>
            </Link>
          </Box>

          {/* Mobile Dropdown Menu */}
          <Menu
            id="menu-appbar"
            anchorEl={anchorElNav}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{ display: { xs: 'block', md: 'none' }, mr: 3 }}
          >
            {!authenticated && (
              <MenuItem onClick={handleCloseNavMenu}>
                <Link className="nav-list" to="/login" style={{ textDecoration: 'none', width: '100%' }}>
                  <Button fullWidth sx={buttonStyle}>
                    <LoginIcon sx={{ mr: 1 }} />
                    Login
                  </Button>
                </Link>
              </MenuItem>
            )}

            {authenticated && (
              <>
                <MenuItem onClick={handleCloseNavMenu}>
                  <Link className="nav-list" to="/logout" style={{ textDecoration: 'none', width: '100%' }}>
                    <Button fullWidth sx={buttonStyle}>
                      Logout
                    </Button>
                  </Link>
                </MenuItem>

                <MenuItem onClick={handleCloseNavMenu}>
                  <Link className="nav-list" to={`/${user.role.toLowerCase()}`} style={{ textDecoration: 'none', width: '100%' }}>
                    <Button fullWidth sx={buttonStyle}>
                      Dashboard
                    </Button>
                  </Link>
                </MenuItem>
              </>
            )}
          </Menu>

        </Toolbar>
      </Container>
    </AppBar>
  );
}

const buttonStyle = {
  my: 2,
  mx: 1,
  color: '#ff6600',
  border: '2px solid #ff6600',
  borderRadius: '8px',
  backgroundColor: 'transparent',
  '&:hover': {
    backgroundColor: '#ff6600',
    color: 'white',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
  },
  textTransform: 'none',
};

export default Navbar;
