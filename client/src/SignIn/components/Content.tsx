import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PersonOutlineIcon from "@mui/icons-material/PersonOutlineRounded";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import SecurityIcon from "@mui/icons-material/SecurityRounded";
import BuildCircleIcon from "@mui/icons-material/BuildCircleRounded";
import { SitemarkIcon } from "./CustomIcons";

const items = [
  {
    icon: <AdminPanelSettingsIcon sx={{ color: "text.secondary" }} />,
    title: "Smart access control",
    description:
      "The app dynamically adjusts to user and admin roles, ensuring every user has access to exactly what they need – no more, no less.",
  },
  {
    icon: <SecurityIcon sx={{ color: "text.secondary" }} />,
    title: "Robust authentication",
    description:
      "Featuring JWT-based session handling and bcrypt password hashing, the app is built with long-term security and stability in mind.",
  },
  {
    icon: <PersonOutlineIcon sx={{ color: "text.secondary" }} />,
    title: "Intuitive and responsive",
    description:
      "Designed with a clear interface and smooth flows, users can sign up, log in, and navigate seamlessly – whether admin or standard user.",
  },
  {
    icon: <BuildCircleIcon sx={{ color: "text.secondary" }} />,
    title: "Clean architecture for extensibility",
    description:
      "The backend is built with modular routes, role-based middleware, and JWT session handling – making it easy to expand with new features or integrate into larger systems.",
  },
];

export default function Content() {
  return (
    <Stack
      sx={{
        flexDirection: "column",
        alignSelf: "top",
        gap: 4,
        maxWidth: 450,
      }}
    >
      <Box sx={{ display: { xs: "none", md: "flex" } }}>
        <SitemarkIcon />
        <Typography
          variant="h4"
          sx={{ color: "rgb(72, 118, 239)", mt: "4px", fontSize: "35px" }}
        >
          JWT Login App
        </Typography>
      </Box>
      {items.map((item, index) => (
        <Stack key={index} direction="row" sx={{ gap: 2 }}>
          {item.icon}
          <div>
            <Typography gutterBottom sx={{ fontWeight: "medium" }}>
              {item.title}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {item.description}
            </Typography>
          </div>
        </Stack>
      ))}
    </Stack>
  );
}
