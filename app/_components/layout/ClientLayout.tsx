'use client';

import React from 'react';
import { Box, CssBaseline, useMediaQuery, useTheme } from '@mui/material';
import { Providers } from '@/app/_components/providers';
import Header from '@/app/_components/Header';
import Sidebar from '@/app/_components/layout/Sidebar';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '@/app/_lib/theme';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Providers>
          <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <Header onMenuClick={handleDrawerToggle} />
            <Sidebar 
              mobileOpen={mobileOpen} 
              onDrawerToggle={handleDrawerToggle}
              isMobile={isMobile}
            />
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                p: 3,
                width: { sm: `calc(100% - ${240}px)` },
                ml: { sm: `${240}px` },
                mt: '64px',
                backgroundColor: '#f5f5f5',
                minHeight: '100vh'
              }}
            >
              {children}
            </Box>
          </Box>
        </Providers>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
} 