import {
  AppBar,
  Container,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Button,
} from "@mui/material";
import React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import theme from "@/theme/theme";
import { useRouter } from "next/router";

const sections = [
  {
    label: "Viaggi",
    url: "/",
  },
  {
    label: "Veicoli",
    url: "/vehicles",
  },
  {
    label: "Autisti",
    url: "/drivers",
  }
];

function Header() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const router = useRouter();

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
    <AppBar position="static">
      <Container
        maxWidth="xl"
        sx={{ padding: `${theme.spacing(8)} !important` }}
      >
        <Toolbar disableGutters>
          <Box display={'flex'} sx={{cursor: 'pointer'}} onClick={() => router.push('/')}>
            <img
              src={"/images/LogoGT.png"}
              alt="Gualtieri Tour Logo"
            />
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {sections.map((section, index) => (
                <MenuItem key={index} onClick={() => handleClickNavMenu(section.url)}>
                  <Typography sx={{ textAlign: "center" }}>
                    {section.label}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {sections.map((section, index) => (
              <Button
                key={index}
                href={section.url}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {section.label}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Header;
