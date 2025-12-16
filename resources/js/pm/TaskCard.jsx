
import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Chip, Box, Avatar, TextField } from '@mui/material';
import axios from './axios.js';

const TaskCard = ({ task, onPickTask }) => {
    const [elapsed, setElapsed] = useState(0);
    const [editingTitle, setEditingTitle] = useState(false);
    const [title, setTitle] = useState(task.title);
    const [editingDesc, setEditingDesc] = useState(false);
    const [description, setDescription] = useState(task.description || '');

    useEffect(() => {
        let total = task.time_logs?.reduce((sum, log) => sum + (log.duration_seconds || 0), 0) || 0;

        if (task.current_timer_start) {
            const start = new Date(task.current_timer_start);
            const interval = setInterval(() => {
                setElapsed(Math.floor((new Date() - start) / 1000) + total);
            }, 1000);
            setElapsed(Math.floor((new Date() - start) / 1000) + total);
            return () => clearInterval(interval);
        } else {
            setElapsed(total);
        }
    }, [task]);

    const formatTime = (seconds) => {
        if (seconds < 60) return `${seconds}s`;
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return h > 0 ? `${h}h ${m}m` : `${m}m`;
    };

    const handleClick = async () => {
        try {
            await axios.post(`/tasks/${task.id}/pick`);
            onPickTask();
        } catch (err) {
            console.error('Pick failed:', err);
        }
    };

    const saveTitle = async () => {
        if (title === task.title) {
            setEditingTitle(false);
            return;
        }

        try {
            await axios.patch(`/tasks/${task.id}`, { title });
            onPickTask(); // refresh
        } catch (err) {
            console.error('Update failed', err);
            setTitle(task.title);
        }
        setEditingTitle(false);
    };

    const saveDescription = async () => {
        if (description === (task.description || '')) {
            setEditingDesc(false);
            return;
        }

        try {
            await axios.patch(`/tasks/${task.id}`, { description });
            onPickTask();
        } catch (err) {
            console.error('Update failed', err);
            setDescription(task.description || '');
        }
        setEditingDesc(false);
    };

    return (
        <Card
            onClick={handleClick}
            sx={{
                mb: 2,
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 },
                boxShadow: 3,
                borderLeft: task.current_timer_start ? '4px solid #4caf50' : 'none'
            }}
        >
            <CardContent sx={{ pb: 2 }}>
                {editingTitle ? (
                    <TextField
                        fullWidth
                        autoFocus
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onBlur={saveTitle}
                        onKeyDown={(e) => e.key === 'Enter' && saveTitle()}
                        variant="standard"
                    />
                ) : (
                    <Typography variant="subtitle1" fontWeight="bold" onClick={(e) => { e.stopPropagation(); setEditingTitle(true); }}>
                        {task.title}
                    </Typography>
                )}

                {editingDesc ? (
                    <TextField
                        fullWidth
                        multiline
                        autoFocus
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        onBlur={saveDescription}
                        variant="standard"
                        sx={{ mt: 1 }}
                    />
                ) : (
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1, mb: 2, minHeight: '20px' }}
                        onClick={(e) => { e.stopPropagation(); setEditingDesc(true); }}
                    >
                        {task.description || 'Click to add description...'}
                    </Typography>
                )}

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                    <Chip label={task.priority.name} size="small" color="primary" variant="outlined" />
                    <Chip label={task.task_type.name} size="small" />
                    {task.severity && <Chip label={task.severity.name} size="small" color="error" />}
                </Box>

                {task.deadline_at && (
                    <Typography variant="caption" color={new Date(task.deadline_at) < new Date() ? 'error' : 'text.secondary'} sx={{ mt: 1, display: 'block' }}>
                        Due {new Date(task.deadline_at).toLocaleDateString()}
                    </Typography>
                )}

                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" fontWeight="medium">
                        ⏱ {formatTime(elapsed)} {task.current_timer_start && <span style={{ color: '#4caf50' }}>● LIVE</span>}
                    </Typography>

                    {task.assignee && (
                        <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>
                            {task.assignee.name.charAt(0).toUpperCase()}
                        </Avatar>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};

export default TaskCard;
