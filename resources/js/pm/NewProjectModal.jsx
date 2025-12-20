import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, CircularProgress } from '@mui/material';
import axios from './axios.js';

const NewProjectModal = ({ open, onClose, onCreated }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!name.trim()) return;
        setLoading(true);
        try {
            await axios.post('/projects', {
                name: name.trim(),
                description: description || null,
            });
            setName('');
            setDescription('');
            onCreated();
            onClose();
        } catch (err) {
            console.error('Project creation failed', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Project Name *"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                />
                <TextField
                    margin="dense"
                    label="Description (optional)"
                    fullWidth
                    multiline
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={!name.trim() || loading}
                >
                    {loading ? <CircularProgress size={24} /> : 'Create Project'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default NewProjectModal;

