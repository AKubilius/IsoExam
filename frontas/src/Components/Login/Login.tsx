import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import { api } from '../Api/Api';
import axios from 'axios';

const ErrorMessages = {
  EMPTY_FIELDS: 'Visi laukai yra privalomi!',
  WRONG_LOGIN: 'Blogas prisijungimas',
  INVALID_CODE: 'Netinkamas patvirtinimo kodas arba jis pasibaigė',
  UNEXPECTED_ERROR: 'Įvyko netikėta klaida, bandykite vėliau',
};

const SUCCESS_MESSAGE = 'Patvirtinimo kodas sėkmingai priimtas!';

const RegisterLoginPage: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerificationRequired, setIsVerificationRequired] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState('');
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds

  // Countdown timer
  useEffect(() => {
    if (isVerificationRequired && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => Math.max(prev - 1, 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isVerificationRequired, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    const formData = new FormData(e.currentTarget);
    const loginData = {
      username: (formData.get('userName') as string) || '',
      password: (formData.get('password') as string) || '',
    };

    try {
      const { data } = await api.post('/api/login', loginData);
      setLoginData(loginData); // Save loginData for 2FA verification
      setIsVerificationRequired(true); // Show the verification code form
      setVerificationMessage(data.Message || 'Patvirtinimo kodas išsiųstas');
      setTimeLeft(300); // Set timer to 5 minutes (300 seconds)
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        error?.response?.status === 400
          ? setErrorMessage(ErrorMessages.WRONG_LOGIN)
          : setErrorMessage(ErrorMessages.UNEXPECTED_ERROR);
      }
    }
    setIsLoading(false);
  };

  const handleVerifyCodeSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    const formData = new FormData(e.currentTarget);
    const verificationData = {
      userName: loginData.username,
      code: formData.get('verificationCode'),
    };

    try {
      const { data } = await api.post('/api/verify-2fa', verificationData);
      sessionStorage.setItem('token', data.accessToken);
      sessionStorage.setItem('username', 'client');
      localStorage.setItem('name', data.userName);
      sessionStorage.setItem('admin', data.admin);
      setVerificationMessage(SUCCESS_MESSAGE);
      window.location.href = '/';
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error?.response?.data?.message === 'Verification code has expired') {
          setErrorMessage(ErrorMessages.INVALID_CODE);
        } else {
          setErrorMessage(ErrorMessages.UNEXPECTED_ERROR);
        }
      }
    }
    setIsLoading(false);
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const { data } = await api.post('/api/resend-2fa', { userName: loginData.username });
      setVerificationMessage(data.Message || 'Patvirtinimo kodas išsiųstas iš naujo.');
      setTimeLeft(300); // Reset timer to 5 minutes
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(ErrorMessages.UNEXPECTED_ERROR);
      }
    }
    setIsLoading(false);
  };

  return (
    <Grid item xs={12} md={6}>
      <Typography variant="h5" gutterBottom>
        {isVerificationRequired ? 'ĮVESKITE PATVIRTINIMO KODĄ' : 'PRISIJUNGTI'}
      </Typography>
      <Box
        component="form"
        onSubmit={isVerificationRequired ? handleVerifyCodeSubmit : handleLoginSubmit}
      >
        {!isVerificationRequired ? (
          <>
            <TextField
              margin="normal"
              required
              fullWidth
              id="userName"
              label="Vartotojo vardas"
              name="userName"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Slaptažodis"
              type="password"
              id="password"
            />
          </>
        ) : (
          <>
            <TextField
              margin="normal"
              required
              fullWidth
              id="verificationCode"
              label="Patvirtinimo kodas"
              name="verificationCode"
              autoFocus
            />
            <Typography variant="body2" sx={{ mt: 1 }}>
              {verificationMessage} Laikas liko: {formatTime(timeLeft)}
            </Typography>
            <Button
              fullWidth
              variant="outlined"
              sx={{ mt: 2 }}
              onClick={handleResendCode}
              disabled={isLoading}
            >
              Gauti naują kodą
            </Button>
          </>
        )}
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        {isVerificationRequired && (
          <Alert severity="success">{verificationMessage}</Alert>
        )}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2, backgroundColor: '#f9a825' }}
          disabled={isLoading}
        >
          {isLoading ? (
            <CircularProgress size={24} sx={{ color: 'white' }} />
          ) : isVerificationRequired ? (
            'PATVIRTINTI'
          ) : (
            'PRISIJUNGTI'
          )}
        </Button>
      </Box>
    </Grid>
  );
};

export default RegisterLoginPage;
