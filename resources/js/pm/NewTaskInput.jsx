import React, { useState, useEffect } from 'react';
import { TextField, Box, Button, Autocomplete, Typography } from '@mui/material';
import axios from './axios.js';

const NewTaskInput = ({ onTaskCreated }) => {
    const [title, setTitle] = useState('');
    const [assigneeId, setAssigneeId] = useState(null);
    const [deadline, setDeadline] = useState('');
    const [projectId, setProjectId] = useState(null);
    const [sprintId, setSprintId] = useState(null);

    const [users, setUsers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [sprints, setSprints] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [usersRes, projectsRes, sprintsRes] = await Promise.all([
                    axios.get('/users'),
                    axios.get('/projects'),
                    axios.get('/sprints')
                ]);

                setUsers(usersRes.data);
                setProjects(projectsRes.data);
                setSprints(sprintsRes.data);
            } catch (err) {
                console.error('Failed to load data', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Compute available sprints based on selected project
    const availableSprints = projectId
        ? sprints.filter(sprint => sprint.project_id === projectId)
        : [];

    const handleSubmit = async () => {
        if (!title.trim()) return;

        // Optional: enforce project selection if you want it truly required
        // if (!projectId) {
        //     alert('Please select a project');
        //     return;
        // }

        try {
            await axios.post('/tasks', {
                title: title.trim(),
                task_type_id: 1,
                assigned_to: assigneeId || null,
                deadline_at: deadline || null,
                sprint_id: sprintId || null, // null = backlog / no sprint
            });

            // Reset form
            setTitle('');
            setAssigneeId(null);
            setDeadline('');
            setProjectId(null);
            setSprintId(null);

            onTaskCreated();
        } catch (err) {
            console.error('Task creation failed', err);
        }
    };

    return (
        <Box sx={{ width: 360 }}>
            <Typography variant="h6" gutterBottom>
                New Task
            </Typography>

            <TextField
                fullWidth
                autoFocus
                label="Task title *"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSubmit()}
                sx={{ mb: 2 }}
            />

            <Autocomplete
                options={users}
                getOptionLabel={(option) => option.name || ''}
                loading={loading}
                onChange={(e, value) => setAssigneeId(value ? value.id : null)}
                renderInput={(params) => (
                    <TextField {...params} label="Assign to (optional)" sx={{ mb: 2 }} />
                )}
            />

            <Autocomplete
                options={projects}
                getOptionLabel={(option) => option.name || ''}
                loading={loading}
                value={projects.find(p => p.id === projectId) || null}
                onChange={(e, value) => {
                    setProjectId(value ? value.id : null);
                    setSprintId(null); // Reset sprint when project changes
                }}
                renderInput={(params) => (
                    <TextField {...params} label="Project" sx={{ mb: 2 }} />
                )}
            />

            <Autocomplete
                options={availableSprints}
                getOptionLabel={(option) => option.name || ''}
                loading={loading}
                disabled={!projectId || availableSprints.length === 0}
                value={availableSprints.find(s => s.id === sprintId) || null}
                onChange={(e, value) => setSprintId(value ? value.id : null)}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Sprint (optional)"
                        placeholder={projectId ? 'Select sprint' : 'Select project first'}
                        sx={{ mb: 2 }}
                    />
                )}
            />

            <TextField
                fullWidth
                type="date"
                label="Deadline (optional)"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 3 }}
            />

            <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={!title.trim() || loading}
            >
                Create Task
            </Button>
        </Box>
    );
};

export default NewTaskInput;