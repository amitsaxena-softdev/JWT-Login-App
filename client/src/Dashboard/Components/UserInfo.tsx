import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  CircularProgress,
  Box,
  Grid,
  Avatar,
  Chip,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  Alert,
  Stack,
  Tooltip,
} from "@mui/material";
import {
  Person,
  Email,
  Phone,
  CalendarToday,
  Male,
  Female,
  AdminPanelSettings,
  PersonOutline,
  Edit,
  Save,
  Cancel,
  Info,
  Notifications,
  Security,
  VerifiedUser,
  AccessTime,
  LocationOn,
  Description,
  Settings,
} from "@mui/icons-material";
import { UserData, UserInfoProps } from "../../types/User";
import { useSnackbar } from "../../utils/SnackbarContext";

/**
 * Enhanced UserInfo Component
 * 
 * Displays comprehensive user information with rich Material UI components
 * including profile picture, detailed user stats, and editable settings.
 * 
 * @param user - User data to display
 * @param loading - Loading state
 * @returns JSX element
 */
const UserInfo: React.FC<UserInfoProps> = ({ user, loading }) => {
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    aboutUser: user?.aboutUser || '',
    newsletter: user?.settings?.newsletter || false,
  });
  const showSnackbar = useSnackbar();

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!user) {
    return (
      <Alert severity="info" sx={{ mt: 4 }}>
        No user data available.
      </Alert>
    );
  }

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || '',
      aboutUser: user.aboutUser || '',
      newsletter: user.settings?.newsletter || false,
    });
    setEditMode(false);
  };

  const handleSave = async () => {
    try {
      // TODO: Implement API call to update user data
      showSnackbar({
        message: 'Profile updated successfully!',
        severity: 'success',
      });
      setEditMode(false);
    } catch (error) {
      showSnackbar({
        message: 'Failed to update profile',
        severity: 'error',
      });
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getGenderIcon = (gender: string) => {
    return gender === 'male' ? <Male color="primary" /> : <Female color="secondary" />;
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
        icon={<PersonOutline />}
        label="User"
        color="primary"
        variant="outlined"
        size="small"
      />
    );
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Profile Header Card */}
      <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            {/* Profile Avatar */}
            <Avatar
              sx={{
                width: 100,
                height: 100,
                fontSize: '2rem',
                bgcolor: user.role === 'admin' ? 'error.main' : 'primary.main',
              }}
            >
              {getInitials(user.firstName, user.lastName)}
            </Avatar>

            {/* User Info */}
            <Box sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Typography variant="h4" component="h1">
                  {user.firstName} {user.lastName}
                </Typography>
                {getRoleChip(user.role)}
              </Box>
              
              <Typography variant="h6" color="text.secondary" gutterBottom>
                @{user.username}
              </Typography>

              <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {getGenderIcon(user.gender)}
                  <Typography variant="body2" color="text.secondary">
                    {user.gender.charAt(0).toUpperCase() + user.gender.slice(1)}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccessTime fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    Member since {new Date(user.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </Stack>
            </Box>

            {/* Edit Button */}
            <Tooltip title={editMode ? "Cancel editing" : "Edit profile"}>
              <IconButton
                color={editMode ? "error" : "primary"}
                onClick={editMode ? handleCancel : handleEdit}
                sx={{ alignSelf: 'flex-start' }}
              >
                {editMode ? <Cancel /> : <Edit />}
              </IconButton>
            </Tooltip>
          </Box>
        </CardContent>
      </Card>

      {/* Two Column Layout for Cards */}
      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        {/* Contact Information Card */}
        <Card sx={{ flex: '1 1 400px', minWidth: 0, boxShadow: 2, display: 'flex', flexDirection: 'column' }}>
          <CardHeader
            title="Contact Information"
            avatar={<Email color="primary" />}
            action={
              editMode && (
                <Tooltip title="Save changes">
                  <IconButton color="primary" onClick={handleSave}>
                    <Save />
                  </IconButton>
                </Tooltip>
              )
            }
          />
          <CardContent sx={{ flexGrow: 1 }}>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <Email color="action" />
                </ListItemIcon>
                <ListItemText
                  primary="Email Address"
                  secondary={
                    editMode ? (
                      <TextField
                        fullWidth
                        size="small"
                        value={editData.email}
                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                        variant="outlined"
                      />
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        {user.email}
                      </Typography>
                    )
                  }
                />
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <Phone color="action" />
                </ListItemIcon>
                <ListItemText
                  primary="Phone Number"
                  secondary={
                    editMode ? (
                      <TextField
                        fullWidth
                        size="small"
                        value={editData.phone}
                        onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                        variant="outlined"
                        placeholder="Enter phone number"
                      />
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        {user.phone || 'Not provided'}
                      </Typography>
                    )
                  }
                />
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <CalendarToday color="action" />
                </ListItemIcon>
                <ListItemText
                  primary="Account Created"
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      {new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </Typography>
                  }
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>

        {/* Personal Information Card */}
        <Card sx={{ flex: '1 1 400px', minWidth: 0, boxShadow: 2, display: 'flex', flexDirection: 'column' }}>
          <CardHeader
            title="Personal Information"
            avatar={<Person color="primary" />}
          />
          <CardContent sx={{ flexGrow: 1 }}>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <Person color="action" />
                </ListItemIcon>
                <ListItemText
                  primary="Full Name"
                  secondary={
                    editMode ? (
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField
                          size="small"
                          value={editData.firstName}
                          onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
                          variant="outlined"
                          placeholder="First Name"
                        />
                        <TextField
                          size="small"
                          value={editData.lastName}
                          onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
                          variant="outlined"
                          placeholder="Last Name"
                        />
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        {user.firstName} {user.lastName}
                      </Typography>
                    )
                  }
                />
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <Security color="action" />
                </ListItemIcon>
                <ListItemText
                  primary="Account Type"
                  secondary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getRoleChip(user.role)}
                      {user.role === 'admin' && (
                        <Tooltip title="Administrator privileges">
                          <VerifiedUser color="success" fontSize="small" />
                        </Tooltip>
                      )}
                    </Box>
                  }
                />
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <Info color="action" />
                </ListItemIcon>
                <ListItemText
                  primary="User ID"
                  secondary={
                    <Typography variant="body2" color="text.secondary" fontFamily="monospace">
                      {user._id}
                    </Typography>
                  }
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Box>

      {/* About Me Card */}
      <Card sx={{ boxShadow: 2 }}>
        <CardHeader
          title="About Me"
          avatar={<Description color="primary" />}
        />
        <CardContent>
          {editMode ? (
            <TextField
              fullWidth
              multiline
              rows={4}
              value={editData.aboutUser}
              onChange={(e) => setEditData({ ...editData, aboutUser: e.target.value })}
              variant="outlined"
              placeholder="Tell us about yourself..."
            />
          ) : (
            <Typography variant="body1" color="text.secondary">
              {user.aboutUser || 'No information provided yet.'}
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Two Column Layout for Bottom Cards */}
      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        {/* Settings Card */}
        <Card sx={{ flex: '1 1 400px', minWidth: 0, boxShadow: 2, display: 'flex', flexDirection: 'column' }}>
          <CardHeader
            title="Account Settings"
            avatar={<Settings color="primary" />}
          />
          <CardContent sx={{ flexGrow: 1 }}>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <Notifications color="action" />
                </ListItemIcon>
                <ListItemText
                  primary="Newsletter Subscription"
                  secondary="Receive updates and notifications"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={editData.newsletter}
                      onChange={(e) => setEditData({ ...editData, newsletter: e.target.checked })}
                      disabled={!editMode}
                    />
                  }
                  label=""
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>

        {/* Account Statistics Card */}
        <Card sx={{ flex: '1 1 400px', minWidth: 0, boxShadow: 2, display: 'flex', flexDirection: 'column' }}>
          <CardHeader
            title="Account Statistics"
            avatar={<VerifiedUser color="primary" />}
          />
          <CardContent sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Paper sx={{ flex: 1, p: 2, textAlign: 'center', bgcolor: 'primary.light' }}>
                <Typography variant="h4" color="white">
                  {Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
                </Typography>
                <Typography variant="body2" color="white">
                  Days Active
                </Typography>
              </Paper>
              <Paper sx={{ flex: 1, p: 2, textAlign: 'center', bgcolor: 'secondary.light' }}>
                <Typography variant="h4" color="white">
                  {user.role === 'admin' ? 'Admin' : 'User'}
                </Typography>
                <Typography variant="body2" color="white">
                  Account Level
                </Typography>
              </Paper>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default UserInfo;
