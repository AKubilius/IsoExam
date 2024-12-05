import { Box, Container, Typography } from '@mui/material';
import AboutPng from '../Photos/About.jpg';
import React from 'react';
import FileUpload from '../FileUpload/FileUpload';
import DownloadButton from '../FileUpload/DownloadButton';
import ContactPopup from '../ContactPopup/ContactPopup';

export default function Home() {
  return (
    <Container
      maxWidth={false} // Ensures the container spans the full width of the page
      sx={{
        minHeight: '20vh', // Full viewport height
        padding: 0, // Remove default padding
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          backgroundColor: '#ffffff',
          position: 'relative',
          alignItems: 'center',
        }}
      >
        {/* Image with Text Overlay */}
        <Box
          sx={{
            backgroundImage: `url(${AboutPng})`, // Replace with your image URL
            backgroundSize: 'cover', // Ensures the image covers the entire box
            backgroundPosition: 'center',
            height: '400px', // Set the height of the box
            width: '80%', // Set the width of the image container
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            color: '#ffffff', // Text color to contrast with the image
          }}
        >
          {/* Text Overlay */}
          <Box
            sx={{
              backgroundColor: 'rgba(0, 0, 0, 0.5)', // Add a semi-transparent background to the text
              padding: '20px',
              borderRadius: '10px',
              textAlign: 'center',
            }}
          >
            <Typography variant="h4" component="h2" gutterBottom>
              ISO/IEC 27001:2022 ISVS informuotumas
            </Typography>
            <Typography variant="body1" gutterBottom>
              Tarptautiniu mastu pripažintas Informacijos saugumo valdymo sistemos (ISVS) standartas
              atnaujintas iki naujausios ISO/IEC 27001:2022 versijos.
            </Typography>
            <Typography variant="body2">
              Įrodyta, kad ISO/IEC 27001:2022 Informacijos saugumo vadybos sistema yra labai naudinga
              visų tipų organizacijoms, nepriklausomai nuo jų tipo ar dydžio, nes konfidencialūs
              duomenys egzistuoja visų tipų įmonėse, o kibernetinės atakos kasdien tampa vis dažnesnės.
              Palikus šią informaciją neatskleistą, gali kilti rimta grėsmė organizacijų stabilumui.
              ISO/IEC 27001:2022 standartas nustato tokios informacijos saugumo pagrindus, todėl yra
              labai naudingas organizacijos apsaugai.
            </Typography>
          </Box>
        </Box>

        {/* Popup Section */}
        <ContactPopup />
      </Box>
    </Container>
  );
}
