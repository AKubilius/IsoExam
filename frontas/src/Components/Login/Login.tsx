import React, { useState } from 'react';
import { Box, Grid, Typography, TextField, Button, Container, IconButton, InputAdornment, Alert, Link } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { api } from '../Api/Api';
import axios from 'axios';

const ErrorMessages = {
  EMPTY_FIELDS: 'Visi laukai yra privalomi!',
  MISSMATCHING_PASSWORDS: 'Slaptažodžiai turi sutapti',
  INCORRECT_PASSWORD_FORMAT:
    'Slaptažodį turi sudaryt bent 8 simboliai, įskaitant skaitmenį, didžiąją raidę ir simbolį',
    WRONG_LOGIN:'Labas',
  INCORRECT_EMAIL_FORMAT: 'Netinkamas El. Paštas',
  UNEXPECTED_ERROR: 'Įvyko netikėta klaida, bandykite vėliau',
};
const SUCCESS_MESSAGE = 'Registracija patvirtinta';

const RegisterLoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [isRegistrationSuccessful, setIsRegistrationSuccessful] =
    useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsLoading(true);
      setErrorMessage("");
      const formData = new FormData(e.currentTarget);
      const loginData = {
        username: formData.get("userName"),
        password: formData.get("password"),
      };
  
      try {
        const { data } = await api.post("/api/login", loginData);
        sessionStorage.setItem("token", data.accessToken);
        sessionStorage.setItem("username", "client");
        localStorage.setItem("name", data.userName);
        sessionStorage.setItem("admin", data.admin);
        window.location.href = "/";
      } catch (error: any) {
        if (axios.isAxiosError(error)) {
          error?.response?.status === 400
            ? setErrorMessage(ErrorMessages.WRONG_LOGIN)
            : setErrorMessage(ErrorMessages.UNEXPECTED_ERROR);
        }
      }
  
      setIsLoading(false);
    };

  return (
          <Grid item xs={12} md={6} >
          <Typography variant="h5" gutterBottom>
              PRISIJUNGTI
            </Typography>
          <Box component='form' onSubmit={handleSubmit} >
            <TextField
              margin='normal'
              required
              fullWidth
              id='userName'
              label='Vartotojo vardas'
              name='userName'
              autoFocus
            />
            
            <TextField
              margin='normal'
              required
              fullWidth
              name='password'
              label='Slaptažodis'
              type='password'
              id='password'
            />
            
            {errorMessage && <Alert severity='error'>{errorMessage}</Alert>}
            {isRegistrationSuccessful && (
              <Alert severity='success'>{SUCCESS_MESSAGE}</Alert>
            )}
            <Button
              type='submit'
              fullWidth
              variant='contained'
              sx={{ mt: 3, mb: 2,backgroundColor: '#f9a825' }}
            >
              PRISJUNGTI
            </Button>
          </Box>

        </Grid>
  );
};

export default RegisterLoginPage;
