import React from "react";
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { AdminPanelProps, UserData } from "../../types/User";

type Props = AdminPanelProps & {
  onDeleteUser: (userId: string) => void;
};

const AdminPanel: React.FC<Props> = ({ users, onDeleteUser }) => {
  if (!users.length) return <Typography>No users found.</Typography>;

  return (
    <Card sx={{ maxWidth: 600, margin: "auto", mt: 4, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          All Registered Users
        </Typography>
        <List>
          {users.map((user) => (
            <ListItem
              key={user._id}
              divider
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  color="error"
                  onClick={() => onDeleteUser(user._id)}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText
                primary={`${user.firstName} ${user.lastName} (@${user.username}) ${
                  user.role === "admin" ? "— Admin" : ""
                }`}
                secondary={user.email}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default AdminPanel;
