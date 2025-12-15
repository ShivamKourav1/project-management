
import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Paper } from '@mui/material';
import TaskCard from './TaskCard.jsx';
import axios from './axios.js';

const KanbanBoard = () => {
    const [columns, setColumns] = useState({});
    const [orderedStatuses, setOrderedStatuses] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [statusesRes, tasksRes] = await Promise.all([
                axios.get('/statuses'),
                axios.get('/tasks')
            ]);

            const statuses = statusesRes.data;
            statuses.sort((a, b) => a.order - b.order);
            setOrderedStatuses(statuses);

            const grouped = {};
            statuses.forEach(status => {
                grouped[status.id] = {
                    id: status.id,
                    name: status.name,
                    tasks: []
                };
            });

            tasksRes.data.forEach(task => {
                if (grouped[task.status_id]) {
                    grouped[task.status_id].tasks.push(task);
                }
            });

            setColumns(grouped);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching data:', err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 15000);
        return () => clearInterval(interval);
    }, []);

    const handlePickTask = () => {
        fetchData();
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', overflowX: 'auto', p: 3, gap: 3, height: '100%' }}>
            {orderedStatuses.map(status => {
                const column = columns[status.id] || { tasks: [] };
                return (
                    <Paper
                        key={status.id}
                        sx={{
                            minWidth: 350,
                            bgcolor: '#fafafa',
                            borderRadius: 2,
                            p: 2,
                            boxShadow: 2
                        }}
                    >
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                            {column.name} ({column.tasks.length})
                        </Typography>

                        {column.tasks.map((task) => (
                            <TaskCard key={task.id} task={task} onPickTask={handlePickTask} />
                        ))}
                    </Paper>
                );
            })}
        </Box>
    );
};

export default KanbanBoard;
