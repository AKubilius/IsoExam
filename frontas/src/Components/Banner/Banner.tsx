import React from 'react';
import { Box, Typography, Grid, Paper, Container } from '@mui/material';

const features = [
  { title: 'Aukšta kokybė', description: 'Mes teikiame aukštos klasės paslaugas.' },
  { title: 'Patikima pagalba', description: 'Į mus galite kreiptis 24/7.' },
  { title: 'Prieinamos kainos', description: 'Geriausios kainos rinkoje.' },
];

const Banner: React.FC = () => (
  <Box sx={{ py: 8 }}>
    <Container maxWidth="lg">
      <Typography variant="h4" align="center" gutterBottom>
        Mūsų prioritetai
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
