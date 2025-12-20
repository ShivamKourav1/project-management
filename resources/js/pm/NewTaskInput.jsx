 import React, { useState, useEffect } from 'react';
import { TextField, Box, Button, Autocomplete, Typography } from '@mui/material';
import axios from './axios.js';

const NewTaskInput = ({ onTaskCreated }) => {
    const [title, setTitle] = useState('');
    const [assigneeId, setAssigneeId] = useState(null);
    const [deadline, setDeadline] = useState('');
    const [sprintId, setSprintId] = useState(null);
    const [users, setUsers] = useState([]);
    const [sprints, setSprints] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [usersRes, sprintsRes] = await Promise.all([
                    axios.get('/users'),
                    axios.get('/sprints')
                ]);
                setUsers(usersRes.data);
                setSprints(sprintsRes.data);
            } catch (err) {
                console.error('Failed to load data', err);
            }
            setLoading(false);
        };

        fetchData();
    }, []);

    const handleSubmit = async () => {
        if (!title.trim()) return;

        try {
            await axios.post('/tasks', {
                title: title.trim(),
                task_type_id: 1, // Default "Task"
                assigned_to: assigneeId,
                deadline_at: deadline || null,
                sprint_id: sprintId,
            });

            setTitle('');
            setAssigneeId(null);
            setDeadline('');
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
                label="Task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                sx={{ mb: 2 }}
            />

            <Autocomplete
                options={users}
                getOptionLabel={(option) => option.name || ''}
                loading={loading}
                onChange={(e, value) => setAssigneeId(value ? value.id : null)}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Assign to (optional)"
                        sx={{ mb: 2 }}
                    />
                )}
            />

            <Autocomplete
                options={sprints}
                getOptionLabel={(option) => option.name || ''}
                loading={loading}
                onChange={(e, value) => setSprintId(value ? value.id : null)}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Sprint (optional)"
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