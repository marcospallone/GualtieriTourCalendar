import { Box, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import React from "react";
import { useRouter } from "next/router";
import theme from "@/theme/theme";
import SignpostIcon from "@mui/icons-material/Signpost";
import AirportShuttleIcon from "@mui/icons-material/AirportShuttle";
import PersonIcon from "@mui/icons-material/Person";

function Sidebar() {
  const router = useRouter();
  const sections = [
    {
      label: "Viaggi",
      url: "/",
      icon: <SignpostIcon />,
    },
    {
      label: "Veicoli",
      url: "/vehicles",
      icon: <AirportShuttleIcon />,
    },
    {
      label: "Autisti",
      url: "/drivers",
      icon: <PersonIcon />,
    },
  ];

  const handleClickMenuItem = (url: any) => {
    router.push(url);
  };
  return (
    <Box sx={{ height: "100vh", padding: theme.spacing(12),  }}>
      <Box>
        <Box
          display={"flex"}
          sx={{ cursor: "pointer" }}
          onClick={() => router.push("/")}
        >
          <img
            src={"/images/LogoGT.png"}
            alt="Gualtieri Tour Logo"
          />
        </Box>
        <List>
          {sections?.map((section, index) => (
            <ListItem
              key={index}
              onClick={() => handleClickMenuItem(section.url)}
              sx={{ px: 0, cursor: "pointer" }}
            >
              <ListItemIcon>{section.icon}</ListItemIcon>
              <ListItemText
                primary={section?.label}
                sx={{ '& .MuiTypography-root' :{fontWeight: 'bold'} }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
}
export default Sidebar;
