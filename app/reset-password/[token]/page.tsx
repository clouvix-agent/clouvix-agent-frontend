'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
import GridPattern from '../../components/GridPattern';

interface ResetPasswordData {
  token: string;
  new_password: string;
  confirm_password: string;
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useParams();
  const [formData, setFormData] = useState<ResetPasswordData>({
    token: '',
    new_password: '',
    confirm_password: '',
  });
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [tokenValidated, setTokenValidated] = useState(false);

  useEffect(() => {
    const token = params?.token as string;
    if (!token) {
      setError('Invalid or missing reset token. Please request a new password reset link.');
      return;
    }
    setFormData(prev => ({ ...prev, token }));
    setTokenValidated(true);
  }, [params]);

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

    if (!formData.token) {
      setError('Invalid or missing reset token. Please request a new password reset link.');
      return;
    }

    // Validate passwords match
    if (formData.new_password !== formData.confirm_password) {
      setError('Passwords do not match');
      return;
    }

    // Validate password length
    if (formData.new_password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://backend.clouvix.com/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: formData.token,
          new_password: formData.new_password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || data.message || 'Failed to reset password');
      }

      setSuccess('Password has been successfully reset. Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValidated) {
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
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Button
                onClick={() => router.push('/forgot-password')}
                variant="contained"
                sx={{ textTransform: 'none' }}
              >
                Request New Reset Link
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>
    );
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
          <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
            Reset Password
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
                id="new_password"
                name="new_password"
                label="New Password"
                type="password"
                variant="outlined"
                value={formData.new_password}
                onChange={handleChange}
                inputProps={{ minLength: 8 }}
              />
              <TextField
                fullWidth
                required
                id="confirm_password"
                name="confirm_password"
                label="Confirm Password"
                type="password"
                variant="outlined"
                value={formData.confirm_password}
                onChange={handleChange}
                inputProps={{ minLength: 8 }}
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