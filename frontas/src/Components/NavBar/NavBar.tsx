import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link/Link';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button/Button';
import { logout } from '../Api/Api';

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const menuItems = [
    { label: 'Pagrindinis', path: '/' },
    { label: 'CIS Kontrolės', path: '/exam' },
    { label: 'ISO 27001 Dokumentacija', path: '/documents' },
    { label: 'Statistika', path: '/graphs' },
  ];

  const logged = sessionStorage.getItem("token");
  const isAdmin = sessionStorage.getItem("admin") === 'true';

  const handleLogOut = (): void => {
    logout();
  };

  return (
    <>
      {/* Top Contact Info Bar */}
      <Box sx={{ backgroundColor: '#f5f5f5', padding: '8px 0', textAlign: 'right' }}>
        <Container maxWidth="xl" sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Typography variant="body2" sx={{ display: 'inline', marginRight: '20px' }}>
            +370 629 666 56 | info@Vilius.lt
          </Typography>
          {!logged && (
            <Typography variant="body2">
              <Link
                component="button"
                onClick={() => navigate('/login')}
                sx={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}
              >
                Prisijungimas / Registracija
              </Link>
            </Typography>
          )}
        </Container>
      </Box>

      {/* Sticky Main Navbar */}
      <AppBar position="sticky" color="default" elevation={1} sx={{ top: 0, backgroundColor: '#ffffff' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between' }}>

            {/* Logo */}
            <Box>
              <Typography variant="h4" component="div" sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', color: '#f9a825' }}>
                <Typography variant="h6" component="span" sx={{ fontWeight: 'bold', color: 'black', ml: 1 }}>
                  ISO 27001 STANDARTO DIEGIMAS
                </Typography>
              </Typography>
            </Box>

            {/* Navigation Menu (Visible only for non-admins) */}
            {!isAdmin && (
              <Box sx={{ display: 'flex', gap: 3 }}>
                {menuItems.map((item) => (
                  <MenuItem key={item.label} onClick={() => navigate(item.path)}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', cursor: 'pointer' }}>
                      {item.label.toUpperCase()}
                    </Typography>
                  </MenuItem>
                ))}
              </Box>
            )}

            {/* Logout Button */}
            {logged && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button
                  onClick={handleLogOut}
                  sx={{
                    cursor: 'pointer',
                    textDecoration: 'none',
                    color: 'inherit',
                  }}
                >
                  <Typography variant="body1" sx={{ fontWeight: 'bold', cursor: 'pointer' }}>
                    ATSIJUNGTI
                  </Typography>
                </Button>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};

export default Navbar;
