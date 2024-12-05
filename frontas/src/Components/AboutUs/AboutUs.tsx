import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';

const AboutUs: React.FC = () => (
  <Box sx={{ py: 6, backgroundColor: '#f9a825', textAlign: 'center' }}>
    <Container maxWidth="sm">
      <Typography variant="h4" sx={{ mb: 2, color: 'white' }}>
       Pasiruošę padėti?
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, color: 'white' }}>
        Join us today and experience top-quality service.
      </Typography>
      <Button component={Link} to='/exam' variant="contained" color="warning" size="large" >
        Pradėti
      </Button>
    </Container>
  </Box>
);

export default AboutUs;
