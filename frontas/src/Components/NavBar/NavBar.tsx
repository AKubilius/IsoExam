import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Badge from '@mui/material/Badge';
import Link from '@mui/material/Link/Link';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button/Button';
import { logout } from '../Api/Api';

const Navbar: React.FC = () => {

  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  
  const menuItems = [
    { label: 'Pagrindinis', path: '/' },
    { label: 'CIS Kontrolės', path: '/exam' },
    { label: 'ISO 27001 Dokumentacija', path: '/documents' },
    { label: 'Statistika', path: '/graphs' },
  ];

  const logged = sessionStorage.getItem("token");

  const handleLogOut = (): void => {
    logout();
  };
  

  return (
    <>
      {/* Top Contact Info Bar (This will scroll away when you scroll) */}
      <Box sx={{ backgroundColor: '#f5f5f5', padding: '8px 0', textAlign: 'right' }}>
        <Container maxWidth="xl" sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Typography variant="body2" sx={{ display: 'inline', marginRight: '20px' }}>
            +370 629 666 56 | info@Vilius.lt
          </Typography>

          {!logged && (
          <Typography variant="body2">
            <Link
              component="button"
              onClick={() => navigate('/login')} // Navigates to /login when clicked
              sx={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }} // Add styles for cursor and color
            >
              Prisijungimas / Registracija
            </Link>
          </Typography>)}

        </Container>
      </Box>

      {/* Sticky Main Navbar */}
      <AppBar position="sticky" color="default" elevation={1} sx={{ top: 0, backgroundColor: '#ffffff' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between' }}>

            {/* Logo */}
            <Box>
              <Typography variant="h4" component="div" sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', color: '#f9a825' }}>
               <Typography variant="h6" component="span" sx={{ fontWeight: 'bold', color: 'black', ml: 1 }}>ISO 27001 STANDARTO DIEGIMAS</Typography>
              </Typography>
            </Box>

            {/* Navigation Menu */}
            <Box sx={{ display: 'flex', gap: 3 }}>
              {menuItems.map((item) => (
                <MenuItem key={item.label} onClick={() => navigate(item.path)}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', cursor: 'pointer' }}>
                    {item.label.toUpperCase()}
                  </Typography>
                </MenuItem>
              ))}
            </Box>

            {/* Icons (Search & Profile) */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {logged && (
              <>
              <Link
                component="button"
                onClick={() => navigate('/profile')} // Navigates to /login when clicked
                sx={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }} // Add styles for cursor and color
              >
                 <Typography variant="body1" sx={{ fontWeight: 'bold', cursor: 'pointer' }}>
                  PROFILIS
                </Typography>
              </Link>
              <Button onClick={handleLogOut}
                sx={{
                  cursor: 'pointer',
                  textDecoration: 'none',
                  color: 'inherit'
                }} ><Typography variant="body1" sx={{ fontWeight: 'bold', cursor: 'pointer' }}>
                  ATSIJUNGTI
                </Typography>
                </Button>
                </>)}
                </Box>
                
                
           
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};

export default Navbar;
