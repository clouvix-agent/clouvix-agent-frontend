'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Container,
  Alert,
  CircularProgress,
  Divider,
  Tab,
  Tabs
} from '@mui/material';
import GridPattern from '../components/GridPattern';
import { setAuthTokens } from '../utils/auth';

interface LoginFormData {
  username: string;
  password: string;
}

interface OtpFormData {
  email: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [loginData, setLoginData] = useState<LoginFormData>({
    username: '',
    password: '',
  });
  const [otpData, setOtpData] = useState<OtpFormData>({
    email: '',
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setError('');
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOtpData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('https://backend.clouvix.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || data.message || 'Login failed');
      }

      // Store the tokens using the utility function
      setAuthTokens(data.access_token, data.token_type);

      try {
        // Fetch user data
        const userResponse = await fetch('https://backend.clouvix.com/users/me', {
          headers: {
            'Authorization': `${data.token_type} ${data.access_token}`
          }
        });

        const userData = await userResponse.json();
        
        if (!userResponse.ok) {
          throw new Error(userData.detail || userData.message || 'Failed to fetch user data');
        }

        localStorage.setItem('user', JSON.stringify(userData));
      } catch (userError) {
        console.error('Error fetching user data:', userError);
        // Even if user data fetch fails, we're still logged in
      }

      // Always redirect to chat page, even if user data fetch fails
      window.location.href = '/chat';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setLoading(false);
    }
  };

  const handleOtpRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('https://backend.clouvix.com/login/otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(otpData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send OTP');
      }

      router.push(`/verify-login-otp?email=${encodeURIComponent(otpData.email)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth={false} sx={{ height: '100vh', bgcolor: 'black', position: 'relative' }}>
      <GridPattern />
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
          position: 'relative',
          zIndex: 1
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            maxWidth: 450,
            bgcolor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: 2,
            backdropFilter: 'blur(10px)'
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
            Sign In
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{ mb: 3 }}
          >
            <Tab label="Password" />
            <Tab label="OTP" />
          </Tabs>

          {activeTab === 0 ? (
            <form onSubmit={handlePasswordLogin}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <TextField
                  fullWidth
                  required
                  id="username"
                  name="username"
                  label="Username"
                  variant="outlined"
                  value={loginData.username}
                  onChange={handleLoginChange}
                />
                <TextField
                  fullWidth
                  required
                  id="password"
                  name="password"
                  label="Password"
                  type="password"
                  variant="outlined"
                  value={loginData.password}
                  onChange={handleLoginChange}
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    mt: 2,
                    bgcolor: '#1976d2',
                    '&:hover': {
                      bgcolor: '#1565c0'
                    }
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </Box>
            </form>
          ) : (
            <form onSubmit={handleOtpRequest}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <TextField
                  fullWidth
                  required
                  id="email"
                  name="email"
                  label="Email Address"
                  type="email"
                  variant="outlined"
                  value={otpData.email}
                  onChange={handleOtpChange}
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    mt: 2,
                    bgcolor: '#1976d2',
                    '&:hover': {
                      bgcolor: '#1565c0'
                    }
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Send OTP'
                  )}
                </Button>
              </Box>
            </form>
          )}

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Link href="/register" style={{ textDecoration: 'none' }}>
              <Typography color="primary" sx={{ '&:hover': { textDecoration: 'underline' }, mb: 1 }}>
                Don't have an account? Sign up
              </Typography>
            </Link>
            <Link href="/forgot-password" style={{ textDecoration: 'none' }}>
              <Typography color="primary" sx={{ '&:hover': { textDecoration: 'underline' } }}>
                Forgot Password?
              </Typography>
            </Link>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
} 