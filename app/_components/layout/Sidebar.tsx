import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  LocationOn as LocationIcon,
  Devices as DevicesIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  mobileOpen: boolean;
  onDrawerToggle: () => void;
  isMobile: boolean;
}

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, href: '/dashboard' },
  { text: 'Locations', icon: <LocationIcon />, href: '/locations' },
  { text: 'Devices', icon: <DevicesIcon />, href: '/devices' },
];

export default function Sidebar({ mobileOpen, onDrawerToggle, isMobile }: SidebarProps) {
  const theme = useTheme();
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const drawer = (
    <List>
      {menuItems.map((item) => (
        <ListItem
          button
          key={item.text}
          component={Link}
          href={item.href}
          selected={isActive(item.href)}
          onClick={() => isMobile && onDrawerToggle()}
        >
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.text} />
        </ListItem>
      ))}
    </List>
  );

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={isMobile ? mobileOpen : true}
      onClose={onDrawerToggle}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
      sx={{
        display: { xs: 'block', sm: 'block' },
        '& .MuiDrawer-paper': {
          boxSizing: 'border-box',
          width: 240,
          top: ['48px', '56px', '64px'],
          height: 'auto',
          bottom: 0,
        },
      }}
    >
      {drawer}
    </Drawer>
  );
} 