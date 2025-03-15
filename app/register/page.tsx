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
  CircularProgress
} from '@mui/material';
import GridPattern from '../components/GridPattern';

interface RegisterFormData {
  username: string;
  email: string;
  name: string;
  organization: string;
  password: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterFormData>({
    username: '',
    email: '',
    name: '',
    organization: '',
    password: '',
  });
  const [error, setError] = useState<string>('');
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
    setLoading(true);

    try {
      const response = await fetch('https://backend.clouvix.com/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
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
            Create Account
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
                id="username"
                name="username"
                label="Username"
                variant="outlined"
                value={formData.username}
                onChange={handleChange}
              />
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
              <TextField
                fullWidth
                required
                id="name"
                name="name"
                label="Full Name"
                variant="outlined"
                value={formData.name}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                required
                id="organization"
                name="organization"
                label="Organization"
                variant="outlined"
                value={formData.organization}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                required
                id="password"
                name="password"
                label="Password"
                type="password"
                variant="outlined"
                value={formData.password}
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
                  'Register'
                )}
              </Button>
            </Box>
          </form>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Link href="/login" style={{ textDecoration: 'none' }}>
              <Typography color="primary" sx={{ '&:hover': { textDecoration: 'underline' } }}>
                Already have an account? Sign in
              </Typography>
            </Link>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
