// src/App.js
import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import DestinationManager from './components/DestinationManager';
import ConnectionManager from './components/ConnectionManager';
import { Container, Typography } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Azul principal
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md">
        <Typography variant="h3" color="primary" gutterBottom>
          Auritas Storage Manager
        </Typography>
        <DestinationManager />
        <ConnectionManager />
      </Container>
    </ThemeProvider>
  );
}

export default App;
