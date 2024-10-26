import { Box, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import React, { useState } from "react";
import { useRouter } from "next/router";
import theme from "@/theme/theme";
import SignpostIcon from "@mui/icons-material/Signpost";
import AirportShuttleIcon from "@mui/icons-material/AirportShuttle";
import PersonIcon from "@mui/icons-material/Person";
import Logo from "../Logo";
import LogoutIcon from "@mui/icons-material/Logout";
import styles from "./Sidebar.module.scss";

function Sidebar() {
  const router = useRouter();
  const [selected, setSelected] = useState(0);
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

  const handleClickMenuItem = (url: any, index: number) => {
    setSelected(index);
    router.push(url);
  };

  const handleLogout = async () => {
    const response = await fetch("/api/logout", {
      method: "POST",
    });

    if (response.ok) {
      router.push("/login");
    } else {
      console.error("Errore durante il logout");
    }
  };

  return (
    <Box className={styles.sidebar}>
      <Box className={styles.sidebarContent}>
        <Box>
          <Logo />
          <List className={styles.menuList}>
            {sections?.map((section, index) => (
              <ListItem
                key={index}
                onClick={() => handleClickMenuItem(section.url, index)}
                className={styles.menuListItem}
              >
                <ListItemIcon
                  sx={{ color: index == selected ? "#EB8317" : "#fff" }}
                >
                  {section.icon}
                </ListItemIcon>
                <ListItemText
                  primary={section?.label}
                  sx={{
                    "& .MuiTypography-root": {
                      fontWeight: "bold",
                      color: index == selected ? "#EB8317" : "#fff",
                    },
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
        <List>
          <ListItem
            onClick={handleLogout}
            sx={{ paddingLeft: 0, paddingRight: 0, cursor: "pointer" }}
          >
            <ListItemIcon sx={{ color: "#fff" }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText
              primary={"Logout"}
              sx={{
                "& .MuiTypography-root": {
                  fontWeight: "bold",
                  color: "#fff",
                },
              }}
            />
          </ListItem>
        </List>
      </Box>
    </Box>
  );
}
export default Sidebar;
