import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  Paper,
  Divider,
  Snackbar,
  Alert,
  Grid,
  CircularProgress,
} from "@mui/material";
import UserInfo from "./Components/UserInfo";
import AdminPanel from "./Components/AdminPanel";
import DeleteIcon from "@mui/icons-material/Delete";

import { UserData } from "../types/User";
import TransparentAppBar from "../shared-theme/TranparentAppBar";
import { useSnackbar } from "../utils/SnackbarContext";
import AppDialog from "../shared-theme/AppDialog";

/**
 * Dashboard Component
 * 
 * Main dashboard interface that displays user information and admin panel
 * based on user role. Handles user data fetching, account management,
 * and admin-specific functionality.
 * 
 * Features:
 * - User profile display
 * - Admin panel for user management (admin users only)
 * - Account deletion functionality
 * - Tab-based navigation
 * - Loading states and error handling
 */
const Dashboard = () => {
  // State management
  const [userData, setUserData] = useState<UserData | null>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // Hooks
  const showSnackbar = useSnackbar();

  // Get authentication token from storage
  const token = sessionStorage.getItem("token") || localStorage.getItem("token");

  /**
   * Fetches user profile data and admin users list if applicable
   * 
   * This function is called on component mount to load the user's
   * profile information and, if the user is an admin, fetch the
   * complete list of users for the admin panel.
   */
  const fetchUserData = async () => {
    try {
      // Fetch user profile
      const response = await fetch("http://localhost:3001/user/profile", {
        method: "GET",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch profile: ${response.status}`);
      }

      const result = await response.json();
      const user = {
        ...result.data,
        isAdmin: result.data.role === "admin",
      };

      setUserData(user);

      // If user is admin, fetch all users for admin panel
      if (user.isAdmin) {
        await fetchAdminUsers();
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      showSnackbar({
        message: error.message || "Failed to fetch user data. Please try again.",
        severity: "error",
      });
      setLoading(false);
    }
  };

  /**
   * Fetches all users for admin panel functionality
   * 
   * Only called when the current user has admin privileges.
   * This data is used to display the user management interface.
   */
  const fetchAdminUsers = async () => {
    try {
      const response = await fetch("http://localhost:3001/admin/getAllUsers", {
        method: "GET",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status}`);
      }

      const result = await response.json();
      setUsersList(result.users || []);
    } catch (error) {
      console.error("Error fetching admin users:", error);
      showSnackbar({
        message: "Failed to fetch users list for admin panel.",
        severity: "error",
      });
    }
  };

  /**
   * Handles user account deletion
   * 
   * Sends a delete request to the server and handles the response.
   * On successful deletion, logs out the user and redirects to login.
   */
  const handleDeleteAccount = async () => {
    try {
      const response = await fetch("http://localhost:3001/user/deleteUser", {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (response.ok) {
        showSnackbar({
          message: "Account deleted successfully",
          severity: "success",
        });
        
        // Logout after successful deletion
        setTimeout(() => {
          handleLogout();
        }, 1000);
      } else {
        throw new Error(result.message || "Unknown error occurred");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      showSnackbar({
        message: error.message || "Failed to delete account. Please try again.",
        severity: "error",
      });
    }
  };

  /**
   * Handles user deletion by admin
   * 
   * Allows admin users to delete other user accounts.
   * Updates the local users list on successful deletion.
   * 
   * @param {string} userId - The ID of the user to delete
   */
  const handleDeleteUserByAdmin = async (userId: string) => {
    try {
      const response = await fetch("http://localhost:3001/admin/deleteUserByAdmin", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      });

      const result = await response.json();

      if (response.ok) {
        // Update local state to remove deleted user
        setUsersList((prev) => prev.filter((user) => user._id !== userId));
        
        showSnackbar({
          message: result.message || "User deleted successfully",
          severity: "success",
        });
      } else {
        throw new Error(result.message || "Error deleting user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      showSnackbar({
        message: error.message || "Failed to delete user. Please try again.",
        severity: "error",
      });
    }
  };

  /**
   * Handles user logout
   * 
   * Sends logout request to server to invalidate token,
   * clears local storage, and reloads the page to reset state.
   */
  const handleLogout = async () => {
    try {
      // Call logout endpoint to invalidate token on server
      await fetch("http://localhost:3001/auth/logout", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      // Clear local storage regardless of server response
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      window.location.reload();
    }
  };

  /**
   * Handles tab change in the dashboard interface
   * 
   * @param {React.SyntheticEvent} event - The tab change event
   * @param {number} newValue - The index of the newly selected tab
   */
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  // Load user data on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  // Loading state
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      {/* Application header with logout functionality */}
      <TransparentAppBar onLogout={handleLogout} />
      
      {/* Dashboard title */}
      <Typography variant="h4" gutterBottom>
        Welcome to your Dashboard
      </Typography>

      {/* Tab navigation */}
      <Paper elevation={3} sx={{ mb: 2 }}>
        <Tabs value={tabIndex} onChange={handleTabChange} centered>
          <Tab label="Profile" />
          {userData?.isAdmin && <Tab label="Admin Panel" />}
        </Tabs>
      </Paper>

      {/* Tab content */}
      <Grid container spacing={2}>
        {/* Profile tab content */}
        {tabIndex === 0 && userData && (
          <Grid size={12}>
            <Paper sx={{ p: 2 }}>
              <UserInfo user={userData} loading={loading} />
            </Paper>
          </Grid>
        )}
        
        {/* Admin panel tab content */}
        {tabIndex === 1 && userData?.isAdmin && (
          <Grid size={12}>
            <Paper sx={{ p: 2 }}>
              <AdminPanel
                users={usersList}
                onDeleteUser={handleDeleteUserByAdmin}
              />
            </Paper>
          </Grid>
        )}
      </Grid>

      <Divider sx={{ my: 4 }} />

      {/* Account deletion section */}
      <Box textAlign="center">
        <Button
          variant="outlined"
          startIcon={<DeleteIcon />}
          color="error"
          onClick={() => setOpenDeleteDialog(true)}
          sx={{
            borderColor: "error.main",
            "&:hover": {
              borderColor: "error.dark",
              backgroundColor: "error.light",
              color: "error.contrastText",
            },
          }}
        >
          Delete Account
        </Button>
      </Box>

      {/* Delete account confirmation dialog */}
      <AppDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        title="Delete Account"
        message="Are you sure you want to delete your account? This action cannot be undone."
        onConfirm={handleDeleteAccount}
        confirmText="Delete"
        type="confirm"
      />
    </Box>
  );
};

export default Dashboard;
