import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import SignpostIcon from "@mui/icons-material/Signpost";
import AirportShuttleIcon from "@mui/icons-material/AirportShuttle";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";

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
    <Paper
      sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
      elevation={3}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          console.log(newValue);
          // setValue(newValue);
        }}
      >
        {sections.map((section, index) => (
          <BottomNavigationAction
            key={index}
            label={section.label}
            icon={section.icon}
            sx={{
              "&.Mui-selected": {
                color: "#EB8317",
              },
            }}
          />
        ))}
        <BottomNavigationAction
          label={"Logout"}
          icon={<LogoutIcon />}
          onClick={handleLogout}
        />
      </BottomNavigation>
    </Paper>
  );
}
export default Navigation;
