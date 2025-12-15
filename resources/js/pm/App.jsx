
import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import KanbanBoard from './KanbanBoard.jsx';
import Filters from './Filters.jsx';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1976d2',
        },
        background: {
            default: '#f4f6f8',
        },
    },
});

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
                <Filters />
                <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                    <KanbanBoard />
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default App;
