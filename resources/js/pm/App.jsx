import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import KanbanBoard from './KanbanBoard.jsx';
import Filters from './Filters.jsx';
import NewProjectModal from './NewProjectModal.jsx';
import NewSprintModal from './NewSprintModal.jsx';
import NewTaskInput from './NewTaskInput.jsx';
import Login from './Login.jsx';
import axios from './axios.js';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: { main: '#1976d2' },
        background: { default: '#f4f6f8' },
    },
});

const App = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const [filters, setFilters] = useState({ priority: 'All', assignee: 'All', sprint: 'All', project: 'All' });

    const [showNewTask, setShowNewTask] = useState(false);
    const [showNewProject, setShowNewProject] = useState(false);
    const [showNewSprint, setShowNewSprint] = useState(false);

    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);

    const checkAuth = async () => {
        try {
            const res = await axios.get('/me'); // We'll add this route shortly
            setUser(res.data);
        } catch (err) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const handleLogin = () => {
        checkAuth();
    };

    const handleRefresh = () => {
        checkAuth(); // In case logout elsewhere
        setShowNewProject(false);
        setShowNewSprint(false);
        setShowNewTask(false);
    };

    if (loading) {
        return (
            <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!user) {
        return <Login onLogin={handleLogin} />;
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
                <Filters 
                filters={filters} 
                setFilters={setFilters} 
                currentUser={user} 
                onLogout={() => setUser(null)} 
                />

                <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                    <KanbanBoard filters={filters} />
                </Box>

                <Fab
                    color="primary"
                    aria-label="add"
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                    sx={{ position: 'fixed', bottom: 16, right: 16 }}
                >
                    <AddIcon />
                </Fab>

                <Menu
                    anchorEl={anchorEl}
                    open={openMenu}
                    onClose={() => setAnchorEl(null)}
                >
                    <MenuItem onClick={() => { setAnchorEl(null); setShowNewProject(true); }}>
                        New Project
                    </MenuItem>
                    <MenuItem onClick={() => { setAnchorEl(null); setShowNewSprint(true); }}>
                        New Sprint
                    </MenuItem>
                    <MenuItem onClick={() => { setAnchorEl(null); setShowNewTask(true); }}>
                        New Task
                    </MenuItem>
                    <MenuItem onClick={async () => {
                        await axios.post('/logout');
                        setUser(null);
                        setAnchorEl(null);
                    }}>
                        Logout ({user.name})
                    </MenuItem>
                </Menu>

                {/* Modals same as before */}
                {showNewProject && (
                    <NewProjectModal open={showNewProject} onClose={() => setShowNewProject(false)} onCreated={handleRefresh} />
                )}
                {showNewSprint && (
                    <NewSprintModal open={showNewSprint} onClose={() => setShowNewSprint(false)} onCreated={handleRefresh} />
                )}
                {showNewTask && (
                    <Box position="fixed" top={0} left={0} right={0} bottom={0} bgcolor="rgba(0,0,0,0.5)"
                         display="flex" justifyContent="center" alignItems="center" zIndex={1300}>
                        <Box bgcolor="background.paper" p={4} borderRadius={2} width="90%" maxWidth={500}>
                            <NewTaskInput onTaskCreated={handleRefresh} />
                            <Button onClick={() => setShowNewTask(false)} sx={{ mt: 2 }}>Cancel</Button>
                        </Box>
                    </Box>
                )}
            </Box>
        </ThemeProvider>
    );
};

export default App;

