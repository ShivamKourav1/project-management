
import React from 'react';
import { AppBar, Toolbar, Typography, Box, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const Filters = () => {
    return (
        <AppBar position="static" color="default" elevation={1}>
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Project Management Tool
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <TextField label="Search tasks" variant="outlined" size="small" />
                    
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Priority</InputLabel>
                        <Select label="Priority">
                            <MenuItem value="">All</MenuItem>
                            <MenuItem value="critical">Critical</MenuItem>
                            <MenuItem value="high">High</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Assignee</InputLabel>
                        <Select label="Assignee">
                            <MenuItem value="">All</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Filters;
