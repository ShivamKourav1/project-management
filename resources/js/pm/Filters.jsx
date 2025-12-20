
import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import axios from './axios.js';

const Filters = ({ filters, setFilters }) => {
  const [priorities, setPriorities] = useState(['All', 'Critical', 'High', 'Medium', 'Low']);
  const [assignees, setAssignees] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [projects, setProjects] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, sprintsRes] = await Promise.all([
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

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Project Management Tool
          </Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 2, display: 'flex', gap: 2 }}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Priority</InputLabel>
          <Select value={filters.priority} onChange={(e) => handleChange('priority', e.target.value)}>
            {priorities.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Assignee</InputLabel>
          <Select value={filters.assignee} onChange={(e) => handleChange('assignee', e.target.value)}>
            {assignees.map(a => <MenuItem key={a.id} value={a.id}>{a.name || 'Unassigned'}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Sprint</InputLabel>
          <Select value={filters.sprint} onChange={(e) => handleChange('sprint', e.target.value)}>
            {sprints.map(s => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 160 }}>
          <InputLabel>Project</InputLabel>
          <Select value={filters.project} onChange={(e) => handleChange('project', e.target.value)}>
            {projects.map(p => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
          </Select>
        </FormControl>
      </Box>
    </>
  );
};

export default Filters;
