import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  IconButton,
  Avatar,
  Chip,
  Box,
  Grid,
  TextField,
  InputAdornment,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Tooltip,
  Menu,
  MenuItem,
  Divider,
  Stack,
  Badge,
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  Delete,
  Search,
  FilterList,
  MoreVert,
  Person,
  AdminPanelSettings,
  PersonOutline,
  Email,
  Phone,
  CalendarToday,
  Male,
  Female,
  Visibility,
  Edit,
  Block,
  CheckCircle,
  Warning,
  Sort,
  Refresh,
  Download,
  Upload,
  Settings,
  Group,
  Security,
  VerifiedUser,
  AccessTime,
} from "@mui/icons-material";
import { AdminPanelProps, UserData } from "../../types/User";
import { useSnackbar } from "../../utils/SnackbarContext";

type Props = AdminPanelProps & {
  onDeleteUser: (userId: string) => void;
};

/**
 * Enhanced AdminPanel Component
 * 
 * Comprehensive user management interface with rich Material UI components
 * including search, filtering, pagination, and detailed user information.
 * 
 * @param users - Array of users to manage
 * @param onDeleteUser - Function to handle user deletion
 * @returns JSX element
 */
const AdminPanel: React.FC<Props> = ({ users, onDeleteUser }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<"all" | "user" | "admin">("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserData | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUserForMenu, setSelectedUserForMenu] = useState<UserData | null>(null);
  
  const showSnackbar = useSnackbar();

  // Filter and search users
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch = 
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = filterRole === "all" || user.role === filterRole;
      
      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, filterRole]);

  // Pagination
  const paginatedUsers = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredUsers.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredUsers, page, rowsPerPage]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0); // Reset to first page when searching
  };

  const handleFilterChange = (role: "all" | "user" | "admin") => {
    setFilterRole(role);
    setPage(0); // Reset to first page when filtering
  };

  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, user: UserData) => {
    setAnchorEl(event.currentTarget);
    setSelectedUserForMenu(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUserForMenu(null);
  };

  const handleViewUser = (user: UserData) => {
    setSelectedUser(user);
    handleMenuClose();
  };

  const handleDeleteClick = (user: UserData) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = () => {
    if (userToDelete) {
      onDeleteUser(userToDelete._id);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
      showSnackbar({
        message: `User ${userToDelete.firstName} ${userToDelete.lastName} deleted successfully`,
        severity: 'success',
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
        icon={<PersonOutline />}
        label="User"
        color="primary"
        variant="outlined"
        size="small"
      />
    );
  };

  const getGenderIcon = (gender: string) => {
    return gender === 'male' ? <Male color="primary" /> : <Female color="secondary" />;
  };

  if (!users.length) {
    return (
      <Alert severity="info" sx={{ mt: 4 }}>
        No users found in the system.
      </Alert>
    );
  }

  return (
    <Box>
      {/* Header with Statistics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.light' }}>
            <Typography variant="h4" color="white">
              {users.length}
            </Typography>
            <Typography variant="body2" color="white">
              Total Users
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'secondary.light' }}>
            <Typography variant="h4" color="white">
              {users.filter(u => u.role === 'admin').length}
            </Typography>
            <Typography variant="body2" color="white">
              Administrators
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.light' }}>
            <Typography variant="h4" color="white">
              {users.filter(u => u.role === 'user').length}
            </Typography>
            <Typography variant="body2" color="white">
              Regular Users
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.light' }}>
            <Typography variant="h4" color="white">
              {users.filter(u => u.gender === 'male').length}
            </Typography>
            <Typography variant="body2" color="white">
              Male Users
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Search and Filter Controls */}
      <Card sx={{ mb: 3, boxShadow: 2 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search users by name, username, or email..."
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Stack direction="row" spacing={1}>
                <Button
                  variant={filterRole === "all" ? "contained" : "outlined"}
                  onClick={() => handleFilterChange("all")}
                  startIcon={<Group />}
                >
                  All
                </Button>
                <Button
                  variant={filterRole === "user" ? "contained" : "outlined"}
                  onClick={() => handleFilterChange("user")}
                  startIcon={<PersonOutline />}
                >
                  Users
                </Button>
                <Button
                  variant={filterRole === "admin" ? "contained" : "outlined"}
                  onClick={() => handleFilterChange("admin")}
                  startIcon={<AdminPanelSettings />}
                >
                  Admins
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={3}>
              <Stack direction="row" spacing={1}>
                <Tooltip title="Refresh data">
                  <IconButton>
                    <Refresh />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Export data">
                  <IconButton>
                    <Download />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Settings">
                  <IconButton>
                    <Settings />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card sx={{ boxShadow: 2 }}>
        <CardHeader
          title={`User Management (${filteredUsers.length} users)`}
          avatar={<Group color="primary" />}
          action={
            <Typography variant="body2" color="text.secondary">
              Showing {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, filteredUsers.length)} of {filteredUsers.length}
            </Typography>
          }
        />
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell>User</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Gender</TableCell>
                  <TableCell>Joined</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedUsers.map((user) => (
                  <TableRow key={user._id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          sx={{
                            bgcolor: user.role === 'admin' ? 'error.main' : 'primary.main',
                          }}
                        >
                          {getInitials(user.firstName, user.lastName)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2">
                            {user.firstName} {user.lastName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            @{user.username}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Email fontSize="small" />
                          {user.email}
                        </Typography>
                        {user.phone && (
                          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Phone fontSize="small" />
                            {user.phone}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      {getRoleChip(user.role)}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getGenderIcon(user.gender)}
                        <Typography variant="body2">
                          {user.gender.charAt(0).toUpperCase() + user.gender.slice(1)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarToday fontSize="small" />
                        {new Date(user.createdAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={<CheckCircle />}
                        label="Active"
                        color="success"
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="More actions">
                        <IconButton
                          onClick={(e) => handleMenuOpen(e, user)}
                          size="small"
                        >
                          <MoreVert />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          {/* Pagination */}
          <TablePagination
            component="div"
            count={filteredUsers.length}
            page={page}
            onPageChange={handlePageChange}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleRowsPerPageChange}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </CardContent>
      </Card>

      {/* User Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => selectedUserForMenu && handleViewUser(selectedUserForMenu)}>
          <Visibility sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        <MenuItem>
          <Edit sx={{ mr: 1 }} />
          Edit User
        </MenuItem>
        <MenuItem>
          <Block sx={{ mr: 1 }} />
          Block User
        </MenuItem>
        <Divider />
        <MenuItem 
          onClick={() => selectedUserForMenu && handleDeleteClick(selectedUserForMenu)}
          sx={{ color: 'error.main' }}
        >
          <Delete sx={{ mr: 1 }} />
          Delete User
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm User Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete user{" "}
            <strong>{userToDelete?.firstName} {userToDelete?.lastName}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            This action cannot be undone and will permanently remove the user from the system.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete User
          </Button>
        </DialogActions>
      </Dialog>

      {/* User Details Dialog */}
      <Dialog 
        open={Boolean(selectedUser)} 
        onClose={() => setSelectedUser(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedUser && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: selectedUser.role === 'admin' ? 'error.main' : 'primary.main',
                  }}
                >
                  {getInitials(selectedUser.firstName, selectedUser.lastName)}
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    @{selectedUser.username}
                  </Typography>
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>Contact Information</Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText
                        primary="Email"
                        secondary={selectedUser.email}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Phone"
                        secondary={selectedUser.phone || 'Not provided'}
                      />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>Account Details</Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText
                        primary="Role"
                        secondary={getRoleChip(selectedUser.role)}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Gender"
                        secondary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {getGenderIcon(selectedUser.gender)}
                            {selectedUser.gender.charAt(0).toUpperCase() + selectedUser.gender.slice(1)}
                          </Box>
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Joined"
                        secondary={new Date(selectedUser.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      />
                    </ListItem>
                  </List>
                </Grid>
                {selectedUser.aboutUser && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>About</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedUser.aboutUser}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedUser(null)}>Close</Button>
              <Button variant="contained">Edit User</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default AdminPanel;
