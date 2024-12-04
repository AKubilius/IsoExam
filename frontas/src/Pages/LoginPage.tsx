import React from 'react'
import NavBar from '../Components/NavBar/NavBar'
import Login from '../Components/Login/Login'
import Container from '@mui/material/Container/Container'
import Box from '@mui/material/Box/Box'
import Typography from '@mui/material/Typography/Typography'
import Register from '../Components/Register/Register'
import Grid from '@mui/material/Grid/Grid'

export default function LoginPage() {
  return (
    <>
    <NavBar/>

    <Box color={'#fefefe'} sx={{bgcolor:'black', paddingTop:5}}>
    <Typography variant="h3" align="center" gutterBottom>
          Mano Paskyra
        </Typography>
        <Typography variant="subtitle1" align="center" gutterBottom sx={{paddingBottom:5}}>
          Pagrindinis / Mano Paskyra
        </Typography>
      </Box>
     <Container maxWidth="lg">
      <Box  sx={{ my: 4}}>
        <Grid container spacing={4} sx={{display:'flex', flexDirection:'row'}}>
    <Register/>
    <Login/>
    </Grid>
    </Box>
    </Container>
    </>
  )
}
