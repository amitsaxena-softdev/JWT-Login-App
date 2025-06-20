import React from "react";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";

import { UserData, UserInfoProps } from "../../types/User";

const UserInfo: React.FC<UserInfoProps> = ({ user, loading }) => {
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Typography sx={{ textAlign: "center", mt: 4 }}>
        Keine Nutzerdaten vorhanden.
      </Typography>
    );
  }

  return (
    <Card sx={{ maxWidth: 500, margin: "auto", mt: 4, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Welcome, {user.firstName} {user.lastName}!
        </Typography>
        <Typography variant="body1">Username: {user.username}</Typography>
        <Typography variant="body1">Email: {user.email}</Typography>
        <Typography variant="body1">Role: {user.role}</Typography>
        {user.gender && (
          <Typography variant="body2">Gender: {user.gender}</Typography>
        )}
        {user.phone && (
          <Typography variant="body2">Phone: {user.phone}</Typography>
        )}
        {user.aboutUser && (
          <Typography variant="body2">About: {user.aboutUser}</Typography>
        )}
        {user.createdAt && (
          <Typography variant="body2">
            Joined: {new Date(user.createdAt).toLocaleDateString()}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default UserInfo;
