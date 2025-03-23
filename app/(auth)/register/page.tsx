'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
  CircularProgress,
} from '@mui/material';
import type { AppDispatch } from '@/app/_lib/store';
import { register } from '@/app/_lib/store/slices/authSlice';
import { toast } from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...registerData } = formData;
      await dispatch(register(registerData)).unwrap();
      toast.success('Registration successful! Please log in.');
      router.push('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Register
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={loading}
            autoComplete="name"
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
            autoComplete="email"
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={loading}
            autoComplete="new-password"
          />
          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            disabled={loading}
            autoComplete="new-password"
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} color="inherit" />}
          >
            {loading ? 'Registering...' : 'Register'}
          </Button>
          <Typography align="center">
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'primary.main' }}>
              Login here
            </Link>
          </Typography>
        </Stack>
      </Box>
    </>
  );
} 