import { Box, Container, Typography } from '@mui/material'
import AboutPng from '../Photos/About.jpg'
import React from 'react'
import FileUpload from '../FileUpload/FileUpload';
import DownloadButton from '../FileUpload/DownloadButton';
import ContactPopup from '../ContactPopup/ContactPopup';

export default function Home() {
  return (
    <Container
      maxWidth={false} // Ensures the container spans the full width of the page
      sx={{
        minHeight: '30vh',       // Full viewport height
        padding: 0             // Remove default padding 
      }}
    >

      <Box sx={{ display: 'flex', flexDirection: 'column', padding: 0, backgroundColor: '#ffffff', position: 'relative', alignItems: 'center' }}>
        <Box
          sx={{
            backgroundImage: `url(${AboutPng})`, // Replace with your image URL
            backgroundSize: 'cover',  // Ensures the image covers the entire box
            height: '400px',  // Set the height of the box
            width: '60%',    // Full width
          }}
        /></Box>
        <ContactPopup />
    </Container>
  );
}
