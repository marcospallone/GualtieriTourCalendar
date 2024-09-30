// src/components/Layout.tsx
import * as React from "react";
import { ReactNode } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Header from "./Header";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      {/* Contenuto della pagina */}
      <Container maxWidth="lg">{children}</Container>
    </>
  );
};

export default Layout;
