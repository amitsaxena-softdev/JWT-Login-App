import { useEffect, useState } from "react";
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

const Dashboard = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);

  const showSnackbar = useSnackbar();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const token =
    sessionStorage.getItem("token") || localStorage.getItem("token");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:3001/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await response.json();
        const user = {
          ...result.data,
          isAdmin: result.data.role === "admin",
        };

        setUserData(user);
        setLoading(false);

        if (user.isAdmin) {
          const res = await fetch("http://localhost:3001/admin/getAllUsers", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const users = await res.json();
          setUsersList(users.users || []);
        }
      } catch (error) {
        showSnackbar({
          message: "Failed to fetch user data. Please try again later.",
          severity: "error",
        });
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch("http://localhost:3001/user/deleteUser", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok) {
        showSnackbar({
          message: "Account deleted successfully",
          severity: "success",
        });
        setTimeout(() => {
          handleLogout();
        }, 1000);
      } else {
        console.log(result);
        throw new Error(result.message || "Unknown error");
      }
    } catch (error) {
      showSnackbar({
        message: error.message || "Failed to delete account. Please try again.",
        severity: "error",
      });
    }
  };

  const handleDeleteUserByAdmin = async (userId: string) => {
  try {
    const res = await fetch("http://localhost:3001/admin/deleteUserByAdmin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId }),
    });

    const result = await res.json();

    if (res.ok) {
      setUsersList((prev) => prev.filter((user) => user._id !== userId));
      showSnackbar({
        message: result.message || "User deleted successfully",
        severity: "success",
      });
    } else {
      throw new Error(result.message || "Error deleting user");
    }
  } catch (error: any) {
    showSnackbar({
      message: error.message || "Failed to delete user. Please try again.",
      severity: "error",
    });
  }
};


  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    window.location.reload();
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <TransparentAppBar onLogout={handleLogout} />
      <Typography variant="h4" gutterBottom>
        Welcome to your Dashboard
      </Typography>

      <Paper elevation={3} sx={{ mb: 2 }}>
        <Tabs value={tabIndex} onChange={handleTabChange} centered>
          <Tab label="Profile" />
          {userData?.isAdmin && <Tab label="Admin Panel" />}
        </Tabs>
      </Paper>

      <Grid container spacing={2}>
        {tabIndex === 0 && userData && (
          <Grid size={12}>
            <Paper sx={{ p: 2 }}>
              <UserInfo user={userData} loading={loading} />
            </Paper>
          </Grid>
        )}
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

      <Box textAlign="center">
        <Button
          variant="outlined"
          startIcon={<DeleteIcon />}
          color="error"
          onClick={() => setOpenDeleteDialog(true)}
          sx={{
            borderColor: "error.main",
            color: "error.main",
            "&:hover": {
              borderColor: "error.dark",
              backgroundColor: "rgba(255, 0, 0, 0.05)",
            },
          }}
        >
          Delete My Account
        </Button>
      </Box>

      <AppDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account"
        message="Are you sure you want to delete your account? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="confirm"
      />
    </Box>
  );
};

export default Dashboard;
