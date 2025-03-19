'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Container,
  Alert,
  CircularProgress
} from '@mui/material';
import GridPattern from '../../components/GridPattern';
import { setAuthTokens } from '../utils/auth';

// Loading component to show while the main component is loading
function VerifyLoginOtpLoading() {
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
            backdropFilter: 'blur(10px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <CircularProgress />
        </Paper>
      </Box>
    </Container>
  );
}

// Main component that uses useSearchParams
function VerifyLoginOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email) {
      router.push('/login');
    }
  }, [email, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('https://backend.clouvix.com/verify-login-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Verification failed');
      }

      // Store the token
      setAuthTokens(data.access_token, data.token_type);

      // Fetch user data
      const userResponse = await fetch('https://backend.clouvix.com/users/me', {
        headers: {
          'Authorization': `${data.token_type} ${data.access_token}`
        }
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        localStorage.setItem('user', JSON.stringify(userData));
      }

      router.push('/chat');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return null;
  }

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
          <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 2 }}>
            Verify Login
          </Typography>
          
          <Typography variant="body1" align="center" color="textSecondary" sx={{ mb: 4 }}>
            Please enter the verification code sent to
            <Typography component="span" color="primary" sx={{ fontWeight: 500 }}>
              {' '}{email}
            </Typography>
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <TextField
                fullWidth
                required
                id="otp"
                name="otp"
                label="Verification Code"
                variant="outlined"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                autoComplete="off"
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
                  'Verify & Login'
                )}
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}

// Main page component with Suspense boundary
export default function VerifyLoginOtpPage() {
  return (
    <Suspense fallback={<VerifyLoginOtpLoading />}>
      <VerifyLoginOtpContent />
    </Suspense>
  );
} 