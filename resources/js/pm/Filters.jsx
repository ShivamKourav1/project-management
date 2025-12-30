import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Box, Select, MenuItem, FormControl, InputLabel, Avatar, IconButton, Menu, Tooltip } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import axios from './axios.js';

const Filters = ({ filters, setFilters, currentUser, onLogout }) => {
  const [priorities] = useState(['All', 'Critical', 'High', 'Medium', 'Low']);
  const [assignees, setAssignees] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [projects, setProjects] = useState([]);

  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, sprintsRes, projectsRes] = await Promise.all([
          axios.get('/users'),
          axios.get('/sprints'),
          axios.get('/projects')
        ]);
        setAssignees([{ id: 'All', name: 'All' }, ...usersRes.data.map(u => ({ id: u.id, name: u.name }))]);
        setSprints([{ id: 'All', name: 'All' }, ...sprintsRes.data]);
        setProjects([{ id: 'All', name: 'All Projects' }, ...projectsRes.data]);
      } catch (err) {
        console.error('Failed to load filters data', err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await axios.post('/logout');
      onLogout();
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Project Management Tool
          </Typography>

          {/* Filters */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Project</InputLabel>
              <Select value={filters.project} onChange={(e) => handleChange('project', e.target.value)}>
                {projects.map(p => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Sprint</InputLabel>
              <Select value={filters.sprint} onChange={(e) => handleChange('sprint', e.target.value)}>
                {sprints.map(s => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Assignee</InputLabel>
              <Select value={filters.assignee} onChange={(e) => handleChange('assignee', e.target.value)}>
                {assignees.map(a => <MenuItem key={a.id} value={a.id}>{a.name}</MenuItem>)}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Priority</InputLabel>
              <Select value={filters.priority} onChange={(e) => handleChange('priority', e.target.value)}>
                {priorities.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
              </Select>
            </FormControl>
          </Box>

          {/* User Info & Logout */}
          <Box sx={{ ml: 4, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Logout">
              <IconButton onClick={handleLogout} color="inherit">
                <LogoutIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title={currentUser?.name || 'User'}>
              <IconButton onClick={handleMenu}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                  {(currentUser?.name?.charAt(0)?.toUpperCase() || 'U')}
                </Avatar>
              </IconButton>
            </Tooltip>

            <Typography variant="body2" sx={{ minWidth: 100 }}>
              {currentUser?.name || 'Guest'}
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem disabled>{currentUser?.email}</MenuItem>
        <MenuItem onClick={handleLogout}>
          <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default Filters;

