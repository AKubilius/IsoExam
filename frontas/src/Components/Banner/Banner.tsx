import React from 'react';
import { Box, Typography, Grid, Paper, Container } from '@mui/material';

const features = [
  { title: 'High Quality', description: 'We provide top-notch services.' },
  { title: 'Reliable Support', description: 'We are here for you 24/7.' },
  { title: 'Affordable Pricing', description: 'Best prices in the market.' },
];

const Banner: React.FC = () => (
  <Box sx={{ py: 8 }}>
    <Container maxWidth="lg">
      <Typography variant="h4" align="center" gutterBottom>
        Our Features
      </Typography>
      <Grid container spacing={4}>
        {features.map((feature, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Paper sx={{ padding: 4, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                {feature.title}
              </Typography>
              <Typography variant="body1">{feature.description}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  </Box>
);

export default Banner;
