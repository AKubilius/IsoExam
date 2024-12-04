import { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { api } from '../Api/Api';
import axios from 'axios';
import Alert from '@mui/material/Alert';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';

const ErrorMessages = {
  EMPTY_FIELDS: 'Visi laukai yra privalomi!',
  MISSMATCHING_PASSWORDS: 'Slaptažodžiai turi sutapti',
  INCORRECT_PASSWORD_FORMAT:
    'Slaptažodį turi sudaryt bent 8 simboliai, įskaitant skaitmenį, didžiąją raidę ir simbolį',
  INCORRECT_EMAIL_FORMAT: 'Netinkamas El. Paštas',
  UNEXPECTED_ERROR: 'Įvyko netikėta klaida, bandykite vėliau',
};

const SUCCESS_MESSAGE = 'Registracija patvirtinta';

export default function RegistrationSide() {
  const [errorMessage, setErrorMessage] = useState('');
  const [isRegistrationSuccessful, setIsRegistrationSuccessful] =
    useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');
    const formData = new FormData(e.currentTarget);
    const registrationData = {
      userName: formData.get('userName'),
      email: formData.get('email'),
      password: formData.get('password'),
      position: formData.get('position'),
      companyName: formData.get('companyName')
    };

    try {
      await api.post('/api/register', registrationData);
      setIsRegistrationSuccessful(true);
      window.location.href = "/home";
    } catch (error: any) {
      setErrorMessage(ErrorMessages.UNEXPECTED_ERROR);
    }
  };
  console.log('asas')
  return (
    <Grid item xs={12} md={6} sx={{ borderRight: '2px solid grey', paddingRight: 5 }} >
      <Typography variant="h5" gutterBottom>
        REGISTRUOTIS
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
          fullWidth
          label="El.paštas"
          name='email'
          variant="outlined"
          margin="normal"
          required
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
        <TextField
          fullWidth
          name='position'
          label="Pozicija"
          variant="outlined"
          margin="normal"
          
        />
         <TextField
          fullWidth
          name='companyName'
          label="Įmonė"
          variant="outlined"
          margin="normal"
        />

        {errorMessage && <Alert severity='error'>{errorMessage}</Alert>}
        {isRegistrationSuccessful && (
          <Alert severity='success'>{SUCCESS_MESSAGE}</Alert>
        )}
        <Typography variant="body2" color="textSecondary" paragraph>
          Jūsų asmeniniai duomenys bus naudojami siekiant palaikyti jūsų patirtį šioje svetainėje, valdyti prieigą prie jūsų paskyros ir saugumo tikslais </Typography>
        <Button
          type='submit'
          fullWidth
          variant='contained'
          sx={{ mt: 3, mb: 2, backgroundColor: '#f9a825' }}
        >
          REGISTRUOTIS
        </Button>
      </Box>

    </Grid>



  );
}