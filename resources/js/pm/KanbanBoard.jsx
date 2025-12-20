
import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Paper, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TaskCard from './TaskCard.jsx';
import NewTaskInput from './NewTaskInput.jsx';
import axios from './axios.js';

const KanbanBoard = ({ filters }) => {
    const [columns, setColumns] = useState({});
    const [orderedStatuses, setOrderedStatuses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showNewTask, setShowNewTask] = useState(false);

    const fetchData = async () => {
        try {
            const [statusesRes, tasksRes] = await Promise.all([
                axios.get('/statuses'),
                axios.get('/tasks')
            ]);

            const statuses = statusesRes.data;
            statuses.sort((a, b) => a.order - b.order);
            setOrderedStatuses(statuses);

            let filteredTasks = tasksRes.data;

            // Safe filtering with null checks
            if (filters.priority !== 'All') {
                filteredTasks = filteredTasks.filter(t => (t.priority?.name || 'None') === filters.priority);
            }
            if (filters.assignee !== 'All') {
                filteredTasks = filteredTasks.filter(t => t.assigned_to === parseInt(filters.assignee));
            }
            if (filters.sprint !== 'All') {
                filteredTasks = filteredTasks.filter(t => t.sprint_id === parseInt(filters.sprint));
            }
            if (filters.project !== 'All') {
               filteredTasks = filteredTasks.filter(t => t.sprint?.project_id === parseInt(filters.project));
            }

            const grouped = {};
            statuses.forEach(status => {
                grouped[status.id] = {
                    id: status.id,
                    name: status.name,
                    tasks: filteredTasks.filter(task => task.status_id === status.id)
                };
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
    }, [filters]);

    const handleTaskCreated = () => {
        fetchData();
        setShowNewTask(false);
    };

    const handlePickTask = () => {
        fetchData();
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <Fab
                color="primary"
                aria-label="add"
                onClick={() => setShowNewTask(true)}
                style={{ position: 'fixed', bottom: 16, right: 16 }}
            >
                <AddIcon />
            </Fab>

            {showNewTask && (
                <Box
                    position="fixed"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    bgcolor="rgba(0, 0, 0, 0.5)"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    zIndex={1300}
                >
                    <Paper elevation={3} style={{ padding: 16, width: '90%', maxWidth: 500 }}>
                        <Typography variant="h6" gutterBottom>
                            Create New Task
                        </Typography>
                        <NewTaskInput onTaskCreated={handleTaskCreated} />
                        <Box mt={2}>
                            <button onClick={() => setShowNewTask(false)}>Cancel</button>
                        </Box>
                    </Paper>
                </Box>
            )}

            <Box display="flex" overflow="auto" p={2}>
                {orderedStatuses.map(status => (
                    <Box key={status.id} mr={2} flexShrink={0} width="300px">
                        <Typography variant="subtitle1" gutterBottom>
                            {status.name}
                        </Typography>
                        <Box display="flex" flexDirection="column" gap={1}>
                            {columns[status.id]?.tasks.map(task => (
                                <TaskCard key={task.id} task={task} onPick={handlePickTask} />
                            ))}
                        </Box>
                    </Box>
                ))}
            </Box>
        </>
    );
};

export default KanbanBoard;
