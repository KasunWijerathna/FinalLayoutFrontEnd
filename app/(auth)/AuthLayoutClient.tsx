'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { Box, Container, Paper } from '@mui/material';
import { RootState } from '@/app/_lib/store';

export default function AuthLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (token) {
      router.push('/dashboard');
    }
  }, [token, router]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        bgcolor: 'background.default',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={2}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {children}
        </Paper>
      </Container>
    </Box>
  );
} 