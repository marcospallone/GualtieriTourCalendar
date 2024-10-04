import * as React from "react";
import { ReactNode } from "react";
import Container from "@mui/material/Container";
import Header from "./Header";
import { Box, useMediaQuery } from "@mui/material";
import theme from "@/theme/theme";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  return (
    <Box display={'flex'} flexDirection={isMobile ? 'column' : 'row'}>
      {isMobile ? <Header /> : <Sidebar />}
      <Container maxWidth="lg" sx={{ maxWidth: '100% !important'}}>{children}</Container>
    </Box>
  );
};

export default Layout;
