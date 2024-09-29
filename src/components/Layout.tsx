// src/components/Layout.tsx
import * as React from 'react';
import { ReactNode } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      {/* Header comune */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Il Mio Progetto</Typography>
        </Toolbar>
      </AppBar>
      
      {/* Contenuto della pagina */}
      <Container maxWidth="lg">
        {children}
      </Container>
    </>
  );
};

export default Layout;
