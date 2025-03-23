'use client';

import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Collapse,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  LocationOn as LocationIcon,
  DevicesOther as DeviceIcon,
  ExpandLess,
  ExpandMore,
  Settings as SettingsIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useRouter, usePathname } from 'next/navigation';

interface SidebarProps {
  mobileOpen: boolean;
  onDrawerToggle: () => void;
  isMobile: boolean;
}

const drawerWidth = 240;

export default function Sidebar({ mobileOpen, onDrawerToggle, isMobile }: SidebarProps) {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [locationsOpen, setLocationsOpen] = React.useState(false);
  const [devicesOpen, setDevicesOpen] = React.useState(false);

  const handleLocationsClick = () => {
    setLocationsOpen(!locationsOpen);
  };

  const handleDevicesClick = () => {
    setDevicesOpen(!devicesOpen);
  };

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard',
    },
    {
      text: 'Locations',
      icon: <LocationIcon />,
      path: '/locations',
      subItems: [
        { text: 'All Locations', path: '/locations' },
        { text: 'Add Location', path: '/locations/new' },
        { text: 'Location Map', path: '/locations/map' },
      ],
    },
    {
      text: 'Devices',
      icon: <DeviceIcon />,
      path: '/devices',
      subItems: [
        { text: 'All Devices', path: '/devices' },
        { text: 'Add Device', path: '/devices/new' },
        { text: 'Device Status', path: '/devices/status' },
      ],
    },
    {
      text: 'Profile',
      icon: <PersonIcon />,
      path: '/profile',
    },
    {
      text: 'Settings',
      icon: <SettingsIcon />,
      path: '/settings',
    },
  ];

  const drawer = (
    <Box>
      <Box sx={{ p: 2 }}>
        <img
          src="/logo.png"
          alt="Logo"
          style={{ width: '100%', maxWidth: '150px' }}
        />
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <React.Fragment key={item.text}>
            <ListItem disablePadding>
              <ListItemButton
                selected={pathname === item.path}
                onClick={() => {
                  if (item.subItems) {
                    if (item.text === 'Locations') {
                      handleLocationsClick();
                    } else if (item.text === 'Devices') {
                      handleDevicesClick();
                    }
                  } else {
                    router.push(item.path);
                    if (isMobile) {
                      onDrawerToggle();
                    }
                  }
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
                {item.subItems && (
                  item.text === 'Locations' ? (
                    locationsOpen ? <ExpandLess /> : <ExpandMore />
                  ) : item.text === 'Devices' ? (
                    devicesOpen ? <ExpandLess /> : <ExpandMore />
                  ) : null
                )}
              </ListItemButton>
            </ListItem>
            {item.subItems && (
              <Collapse
                in={
                  (item.text === 'Locations' && locationsOpen) ||
                  (item.text === 'Devices' && devicesOpen)
                }
                timeout="auto"
                unmountOnExit
              >
                <List component="div" disablePadding>
                  {item.subItems.map((subItem) => (
                    <ListItemButton
                      key={subItem.text}
                      selected={pathname === subItem.path}
                      onClick={() => {
                        router.push(subItem.path);
                        if (isMobile) {
                          onDrawerToggle();
                        }
                      }}
                      sx={{ pl: 4 }}
                    >
                      <ListItemText primary={subItem.text} />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={onDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      )}
    </Box>
  );
} 