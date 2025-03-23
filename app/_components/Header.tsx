'use client';

import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../_lib/store/slices/authSlice';
import { RootState, AppDispatch } from '../_lib/store';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationsAnchor, setNotificationsAnchor] = useState<null | HTMLElement>(null);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationsOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setNotificationsAnchor(null);
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout());
      handleMenuClose(); // Close the menu before redirecting
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if the API call fails, we should still clear the local state and redirect
      handleMenuClose();
      router.push('/login');
    }
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ display: { xs: 'none', sm: 'block' } }}
        >
          Location Device Manager
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton color="inherit" onClick={handleNotificationsOpen}>
            <Badge badgeContent={4} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton
            edge="end"
            aria-label="account of current user"
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <Avatar sx={{ width: 32, height: 32 }}>
              {user?.name?.charAt(0) || 'U'}
            </Avatar>
          </IconButton>
        </Box>
      </Toolbar>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
      >
        <MenuItem onClick={() => router.push('/profile')}>
          <Avatar sx={{ mr: 1, width: 24, height: 24 }} />
          Profile
        </MenuItem>
        <MenuItem onClick={() => router.push('/settings')}>
          <SettingsIcon sx={{ mr: 1 }} />
          Settings
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <LogoutIcon sx={{ mr: 1 }} />
          Logout
        </MenuItem>
      </Menu>

      <Menu
        anchorEl={notificationsAnchor}
        open={Boolean(notificationsAnchor)}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
      >
        <MenuItem>
          <Typography variant="body2">New device added to Location A</Typography>
        </MenuItem>
        <MenuItem>
          <Typography variant="body2">Device B status changed to Inactive</Typography>
        </MenuItem>
        <MenuItem>
          <Typography variant="body2">System maintenance scheduled</Typography>
        </MenuItem>
      </Menu>
    </AppBar>
  );
} 