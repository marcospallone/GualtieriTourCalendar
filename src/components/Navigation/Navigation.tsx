import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import SignpostIcon from "@mui/icons-material/Signpost";
import AirportShuttleIcon from "@mui/icons-material/AirportShuttle";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import styles from "./Navigation.module.scss";

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

function Navigation() {
  const router = useRouter();

  const [value, setValue] = useState(0);

  useEffect(() => {
    if (value != 3) {
      router.push(sections[Number(value)].url);
    }
  }, [value]);

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
    <Paper className={styles.navigationPaper} elevation={3}>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >
        {sections.map((section, index) => (
          <BottomNavigationAction
            className={styles.menuAction}
            key={index}
            label={section.label}
            icon={section.icon}
            sx={{
              "&.Mui-selected": {
                color: "#EB8317 !important",
              },
            }}
          />
        ))}
        <BottomNavigationAction
          className={styles.logoutAction}
          label={"Logout"}
          icon={<LogoutIcon />}
          onClick={handleLogout}
        />
      </BottomNavigation>
    </Paper>
  );
}
export default Navigation;
