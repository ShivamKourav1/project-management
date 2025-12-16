
import React, { useState } from 'react';
import { TextField, Box, IconButton, Chip, Autocomplete } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import axios from './axios.js';

const NewTaskInput = ({ onTaskCreated }) => {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [assigneeId, setAssigneeId] = useState(null);
    const [deadline, setDeadline] = useState('');
    const [users, setUsers] = useState([]);

    // Fetch users once when opening
    const handleOpen = async () => {
        setOpen(true);
        try {
            const res = await axios.get('/users'); // Add a simple /api/users endpoint if not exists
            setUsers(res.data);
        } catch (err) {
            console.error('Failed to load users', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        try {
            await axios.post('/tasks', {
                title,
                task_type_id: 1, // Default "Task" — can be made selectable later
                assigned_to: assigneeId,
                deadline_at: deadline || null,
            });

            setTitle('');
            setAssigneeId(null);
            setDeadline('');
            setOpen(false);
            onTaskCreated?.();
        } catch (err) {
            console.error('Task creation failed', err);
        }
    };

    if (!open) {
        return (
            <Box sx={{ p: 2, textAlign: 'center' }}>
                <IconButton onClick={handleOpen} color="primary" size="large">
                    <AddIcon fontSize="large" />
                </IconButton>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 2 }}>
            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    autoFocus
                    size="small"
                    placeholder="Task title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    sx={{ mb: 1 }}
                />

                <Autocomplete
                    options={users}
                    getOptionLabel={(option) => option.name}
                    onChange={(e, value) => setAssigneeId(value ? value.id : null)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            size="small"
                            placeholder="Assign to (optional)"
                            sx={{ mb: 1 }}
                        />
                    )}
                />

                <TextField
                    fullWidth
                    size="small"
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    label="Deadline (optional)"
                    sx={{ mb: 1 }}
                />

                {assigneeId && (
                    <Chip
                        label={users.find(u => u.id === assigneeId)?.name || ''}
                        onDelete={() => setAssigneeId(null)}
                        color="primary"
                        sx={{ mb: 1 }}
                    />
                )}
            </form>
        </Box>
    );
};

export default NewTaskInput;
