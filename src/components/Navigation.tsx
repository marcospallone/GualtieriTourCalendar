import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Paper,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import SignpostIcon from "@mui/icons-material/Signpost";
import AirportShuttleIcon from "@mui/icons-material/AirportShuttle";
import PersonIcon from "@mui/icons-material/Person";

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
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const router = useRouter();

  const [value, setValue] = useState(0);

  useEffect(() => {
    router.push(sections[Number(value)].url)
  }, [value])

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  
  const handleClickNavMenu = (url:string) => {
    setAnchorElNav(null);
    router.push(url)
  };

  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        >
          {sections.map((section, index) => (
            <BottomNavigationAction key={index} label={section.label} icon={section.icon} sx={{'&.Mui-selected': {
            color: '#EB8317',
          }}} />
          ))}
        </BottomNavigation>
      </Paper>
  );
}
export default Navigation;
