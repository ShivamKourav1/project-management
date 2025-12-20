import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Autocomplete, CircularProgress } from '@mui/material';
import axios from './axios.js';

const NewSprintModal = ({ open, onClose, onCreated }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [projectId, setProjectId] = useState(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);

    useEffect(() => {
        if (open) {
            setFetching(true);
            axios.get('/projects')
                .then(res => setProjects(res.data))
                .finally(() => setFetching(false));
        }
    }, [open]);

    const handleSubmit = async () => {
        if (!name.trim() || !projectId || !startDate || !endDate) return;

        setLoading(true);
        try {
            await axios.post('/sprints', {
                name: name.trim(),
                description: description || null,
                start_date: startDate,
                end_date: endDate,
                project_id: projectId,
            });
            setName('');
            setDescription('');
            setStartDate('');
            setEndDate('');
            setProjectId(null);
            onCreated();
            onClose();
        } catch (err) {
            console.error('Sprint creation failed', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Create New Sprint</DialogTitle>
            <DialogContent>
                <Autocomplete
                    options={projects}
                    getOptionLabel={(option) => option.name || ''}
                    loading={fetching}
                    onChange={(e, value) => setProjectId(value ? value.id : null)}
                    renderInput={(params) => (
                        <TextField {...params} label="Project *" margin="dense" fullWidth />
                    )}
                />

                <TextField
                    autoFocus
                    margin="dense"
                    label="Sprint Name *"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <TextField
                    margin="dense"
                    label="Description (optional)"
                    fullWidth
                    multiline
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <TextField
                    margin="dense"
                    label="Start Date *"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />

                <TextField
                    margin="dense"
                    label="End Date *"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={!name || !projectId || !startDate || !endDate || loading}
                >
                    {loading ? <CircularProgress size={24} /> : 'Create Sprint'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default NewSprintModal;

