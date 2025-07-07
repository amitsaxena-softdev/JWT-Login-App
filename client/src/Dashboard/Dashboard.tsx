import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Paper,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Chip,
  Button,
  Stack,
  Divider,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  Breadcrumbs,
  Link,
  AppBar,
  Toolbar,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Person,
  AdminPanelSettings,
  Logout,
  Home,
  Settings,
  Notifications,
  Refresh,
  TrendingUp,
  Group,
  Security,
  VerifiedUser,
  AccessTime,
  CalendarToday,
  Email,
  Phone,
} from "@mui/icons-material";
import { useAuth } from "../utils/AuthContext";
import { useSnackbar } from "../utils/SnackbarContext";
import UserInfo from "./Components/UserInfo";
import AdminPanel from "./Components/AdminPanel";
import { userApi, adminApi } from "../utils/api";
import { UserData } from "../types/User";

/**
 * Dashboard Component
 * 
 * Main dashboard interface with tabbed navigation for user profile
 * and admin panel (if user is admin). Features enhanced Material UI
 * components and comprehensive user information display.
 * 
 * @returns JSX element
 */
const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const showSnackbar = useSnackbar();
  
  const [activeTab, setActiveTab] = useState(0);
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);

  // Set user data from AuthContext
  useEffect(() => {
    if (user) {
      setUserData(user);
      setUserLoading(false);
    }
  }, [user]);

  // Fetch all users for admin panel
  useEffect(() => {
    const fetchUsers = async () => {
      if (user?.role === "admin") {
        try {
          setLoading(true);
          const response = await adminApi.getAllUsers();
          if (response.success && response.data) {
            setUsers(response.data);
          }
        } catch (error) {
          console.error("Error fetching users:", error);
          showSnackbar({
            message: "Failed to load users",
            severity: "error",
          });
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user, showSnackbar]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleLogout = async () => {
    try {
      await logout();
      showSnackbar({
        message: "Logged out successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Logout error:", error);
      showSnackbar({
        message: "Logout failed",
        severity: "error",
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await adminApi.deleteUser(userId);
      
      // Remove user from local state
      setUsers(users.filter((u) => u._id !== userId));
      
      showSnackbar({
        message: "User deleted successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      showSnackbar({
        message: "Failed to delete user",
        severity: "error",
      });
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getRoleChip = (role: string) => {
    return role === 'admin' ? (
      <Chip
        icon={<AdminPanelSettings />}
        label="Administrator"
        color="error"
        variant="filled"
        size="small"
      />
    ) : (
      <Chip
        icon={<Person />}
        label="User"
        color="primary"
        variant="outlined"
        size="small"
      />
    );
  };

  if (!user) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.50" }}>
      {/* Top App Bar */}
      <AppBar position="static" elevation={0} sx={{ bgcolor: "white", color: "text.primary" }}>
        <Toolbar>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexGrow: 1 }}>
            <DashboardIcon color="primary" />
            <Typography variant="h6" component="div">
              Dashboard
            </Typography>
          </Box>
          
          <Stack direction="row" spacing={2} alignItems="center">
            <Tooltip title="Refresh">
              <IconButton>
                <Refresh />
              </IconButton>
            </Tooltip>
            <Tooltip title="Notifications">
              <IconButton>
                <Notifications />
              </IconButton>
            </Tooltip>
            <Tooltip title="Settings">
              <IconButton>
                <Settings />
              </IconButton>
            </Tooltip>
            <Divider orientation="vertical" flexItem />
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: user.role === 'admin' ? 'error.main' : 'primary.main',
                }}
              >
                {getInitials(user.firstName, user.lastName)}
              </Avatar>
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Typography variant="body2" fontWeight="medium">
                  {user.firstName} {user.lastName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  @{user.username}
                </Typography>
              </Box>
            </Box>
            <Tooltip title="Logout">
              <IconButton onClick={handleLogout} color="error">
                <Logout />
              </IconButton>
            </Tooltip>
          </Stack>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link href="#" color="inherit" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Home fontSize="small" />
            Home
          </Link>
          <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <DashboardIcon fontSize="small" />
            Dashboard
          </Typography>
        </Breadcrumbs>

        {/* Welcome Banner */}
        <Card sx={{ mb: 4, bgcolor: 'primary.main', color: 'white' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: 'white',
                  color: 'primary.main',
                  fontSize: '2rem',
                }}
              >
                {getInitials(user.firstName, user.lastName)}
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h4" gutterBottom>
                  Welcome back, {user.firstName}! 👋
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Here's what's happening with your account today.
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                  {getRoleChip(user.role)}
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Member since {new Date(user.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>

            </Box>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
          <Card sx={{ textAlign: 'center', bgcolor: 'success.light', color: 'white', flex: 1, minWidth: 200 }}>
            <CardContent>
              <TrendingUp sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4">
                {Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
              </Typography>
              <Typography variant="body2">Days Active</Typography>
            </CardContent>
          </Card>
          <Card sx={{ textAlign: 'center', bgcolor: 'info.light', color: 'white', flex: 1, minWidth: 200 }}>
            <CardContent>
              <Security sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4">
                {user.role === 'admin' ? 'Admin' : 'User'}
              </Typography>
              <Typography variant="body2">Account Level</Typography>
            </CardContent>
          </Card>
          <Card sx={{ textAlign: 'center', bgcolor: 'warning.light', color: 'white', flex: 1, minWidth: 200 }}>
            <CardContent>
              <Email sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4">
                {user.email ? 'Verified' : 'Pending'}
              </Typography>
              <Typography variant="body2">Email Status</Typography>
            </CardContent>
          </Card>
          <Card sx={{ textAlign: 'center', bgcolor: 'secondary.light', color: 'white', flex: 1, minWidth: 200 }}>
            <CardContent>
              <VerifiedUser sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4">
                Active
              </Typography>
              <Typography variant="body2">Account Status</Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Main Content Tabs */}
        <Paper sx={{ boxShadow: 2 }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              aria-label="dashboard tabs"
              sx={{
                "& .MuiTab-root": {
                  minHeight: 64,
                  fontSize: "1rem",
                },
              }}
            >
              <Tab
                icon={<Person />}
                label="My Profile"
                iconPosition="start"
                sx={{ flexDirection: "row", gap: 1 }}
              />
              {user.role === "admin" && (
                <Tab
                  icon={<AdminPanelSettings />}
                  label="Admin Panel"
                  iconPosition="start"
                  sx={{ flexDirection: "row", gap: 1 }}
                />
              )}
            </Tabs>
          </Box>

          <Box sx={{ p: 3 }}>
            {activeTab === 0 && (
              <UserInfo user={userData} loading={userLoading} />
            )}
            
            {activeTab === 1 && user.role === "admin" && (
              <AdminPanel users={users} onDeleteUser={handleDeleteUser} />
            )}
          </Box>
        </Paper>

        {/* Footer */}
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            © 2024 JWT Login App. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Dashboard;
