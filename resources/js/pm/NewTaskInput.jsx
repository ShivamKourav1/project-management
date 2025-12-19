
import React, { useState, useEffect } from 'react';
import { TextField, Box, Button, Autocomplete, Typography } from '@mui/material';
import axios from './axios.js';

const NewTaskInput = ({ onTaskCreated }) => {
    const [title, setTitle] = useState('');
    const [assigneeId, setAssigneeId] = useState(null);
    const [deadline, setDeadline] = useState('');
    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoadingUsers(true);
            try {
                const res = await axios.get('/users');
                setUsers(res.data);
            } catch (err) {
                console.error('Failed to load users', err);
            }
            setLoadingUsers(false);
        };

        fetchUsers();
    }, []);

    const handleSubmit = async () => {
        if (!title.trim()) return;

        try {
            await axios.post('/tasks', {
                title: title.trim(),
                task_type_id: 1, // Default "Task"
                assigned_to: assigneeId,
                deadline_at: deadline || null,
            });

            setTitle('');
            setAssigneeId(null);
            setDeadline('');
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
                loading={loadingUsers}
                onChange={(e, value) => setAssigneeId(value ? value.id : null)}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Assign to (optional)"
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
                disabled={!title.trim()}
            >
                Create Task
            </Button>
        </Box>
    );
};

export default NewTaskInput;
