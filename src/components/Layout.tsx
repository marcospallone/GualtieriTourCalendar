import * as React from "react";
import { ReactNode } from "react";
import Container from "@mui/material/Container";
import Navigation from "./Navigation";
import { Box, useMediaQuery } from "@mui/material";
import theme from "@/theme/theme";
import Sidebar from "./Sidebar";
import Logo from "./Logo";
import { useRouter } from "next/router";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const router = useRouter();

  return (
    <Box display={'flex'} flexDirection={isMobile ? 'column' : 'row'}>
      {router.asPath.includes('/login') ? null : isMobile ? <Navigation /> : <Sidebar />}
      {isMobile ? <Logo /> : null}
      <Container maxWidth="lg" sx={{ maxWidth: '100% !important'}}>{children}</Container>
    </Box>
  );
};

export default Layout;
