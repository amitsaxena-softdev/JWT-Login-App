import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import { SitemarkIcon } from "./customizations/CustomIcons";

interface TransparentAppBarProps {
  onLogout: () => void;
}

const TransparentAppBar: React.FC<TransparentAppBarProps> = ({ onLogout }) => {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: "transparent",
        backdropFilter: "blur(4px)",
        boxShadow: "none",
        px: 2,
        mt: -6,
        mb: 2,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <SitemarkIcon />
          <Typography
            variant="h5"
            sx={{
              color: "rgb(72, 118, 239)",
              fontWeight: 600,
              fontSize: "1.8rem",
            }}
          >
            JWT Login App
          </Typography>
        </Box>

        <Button color="error" variant="contained" onClick={onLogout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default TransparentAppBar;
