'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  Alert,
  CircularProgress,
} from '@mui/material';
import { login } from '@/app/_lib/store/slices/authSlice';
import { AppDispatch } from '@/app/_lib/store';

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await dispatch(login(formData)).unwrap();
      router.refresh();
      const from = searchParams.get('from') || '/dashboard';
      router.push(from);
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography component="h1" variant="h5" gutterBottom>
        Sign in
      </Typography>

      {error && (
        <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        autoFocus
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="current-password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Sign In'}
      </Button>
      <Box sx={{ textAlign: 'center' }}>
        <Link href="/register" variant="body2">
          {"Don't have an account? Sign Up"}
        </Link>
      </Box>
    </Box>
  );
} 