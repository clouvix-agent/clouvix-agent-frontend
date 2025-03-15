'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Container,
  Alert,
  CircularProgress,
} from '@mui/material';
import GridPattern from '../components/GridPattern';

interface ForgotPasswordData {
  email: string;
  reset_url: string;
}

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<ForgotPasswordData>({
    email: '',
    reset_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://app.clouvix.com'}/reset-password/{token}`,
  });
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch('https://backend.clouvix.com/forget-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          reset_url: formData.reset_url // Backend will append ?token=xyz to this URL
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || data.message || 'Failed to process request');
      }

      setSuccess('A password reset link has been sent to your email. Please check your inbox and click the link to reset your password.');
      setTimeout(() => {
        router.push('/login');
      }, 3000);
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
            Forgot Password
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <TextField
                fullWidth
                required
                id="email"
                name="email"
                label="Email Address"
                type="email"
                variant="outlined"
                value={formData.email}
                onChange={handleChange}
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
                  'Reset Password'
                )}
              </Button>
            </Box>
          </form>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button
              onClick={() => router.push('/login')}
              sx={{ textTransform: 'none' }}
            >
              Back to Login
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
} 