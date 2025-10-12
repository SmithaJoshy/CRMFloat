import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  AccountTree as PipelineIcon,
  People as PeopleIcon,
  TrendingUp as LeadsIcon,
  Star as BeyondCareIcon,
  Timeline as WorkflowIcon,
  ViewKanban as KanbanIcon,
  Payment as PaymentIcon,
  Receipt as InvoiceIcon,
  Description as DocumentIcon,
  AccountCircle as AccountIcon,
  Logout as LogoutIcon,
  ChevronLeft as ChevronLeftIcon,
  Palette as DesignersIcon,
  Group as TeamIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import GroupedNavigation from './GroupedNavigation';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard', category: 'main' },
  { text: 'Leads', icon: <LeadsIcon />, path: '/leads', category: 'sales' },
  { text: 'Pipeline', icon: <PipelineIcon />, path: '/pipeline', category: 'sales' },
  { text: 'Kanban', icon: <KanbanIcon />, path: '/kanban', category: 'project' },
  { text: 'Workflow', icon: <WorkflowIcon />, path: '/workflow', category: 'project' },
  { text: 'Team', icon: <TeamIcon />, path: '/team', category: 'project' },
  { text: 'Clients', icon: <PeopleIcon />, path: '/clients', category: 'customer' },
  { text: 'Customer Success', icon: <BeyondCareIcon />, path: '/customer-success', category: 'customer' },
  { text: 'Invoices', icon: <InvoiceIcon />, path: '/invoices', category: 'finance' },
  { text: 'Payments', icon: <PaymentIcon />, path: '/payments', category: 'finance' },
  { text: 'Documents', icon: <DocumentIcon />, path: '/documents', category: 'tools' },
];

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  const drawer = (
    <Box>
      <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            {/* CRMFloat Logo */}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 'bold', 
                  color: '#000',
                  fontSize: '1.4rem',
                  lineHeight: 1,
                  fontFamily: 'sans-serif'
                }}>
                  CRMFl
                </Typography>
                <Box sx={{ 
                  width: 16, 
                  height: 16, 
                  backgroundColor: '#4CAF50', 
                  borderRadius: '50%',
                  mx: 0.3
                }} />
                <Typography variant="h6" sx={{ 
                  fontWeight: 'bold', 
                  color: '#000',
                  fontSize: '1.4rem',
                  lineHeight: 1,
                  fontFamily: 'sans-serif'
                }}>
                  at
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ 
                color: '#666',
                fontSize: '0.65rem',
                fontWeight: 500,
                letterSpacing: '0.5px',
                mt: 0.1
              }}>
                SIMPLE CRM FOR STARTUPS
              </Typography>
            </Box>
          </Box>
        <IconButton onClick={handleDrawerToggle}>
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>
      <Divider />
      <GroupedNavigation 
        menuItems={menuItems}
        currentPath={location.pathname}
        onNavigate={(path) => handleNavigation(path)}
      />
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            {/* CRMFloat Logo */}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 'bold', 
                  color: '#fff',
                  fontSize: '1.5rem',
                  lineHeight: 1,
                  fontFamily: 'sans-serif'
                }}>
                  CRMFl
                </Typography>
                <Box sx={{ 
                  width: 18, 
                  height: 18, 
                  backgroundColor: '#4CAF50', 
                  borderRadius: '50%',
                  mx: 0.4
                }} />
                <Typography variant="h6" sx={{ 
                  fontWeight: 'bold', 
                  color: '#fff',
                  fontSize: '1.5rem',
                  lineHeight: 1,
                  fontFamily: 'sans-serif'
                }}>
                  at
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ 
                color: '#e0e0e0',
                fontSize: '0.7rem',
                fontWeight: 500,
                letterSpacing: '0.5px',
                mt: 0.1
              }}>
                SIMPLE CRM FOR STARTUPS
              </Typography>
            </Box>
          </Box>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenuOpen}
            color="inherit"
          >
            <Avatar sx={{ width: 32, height: 32 }}>
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <AccountIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
