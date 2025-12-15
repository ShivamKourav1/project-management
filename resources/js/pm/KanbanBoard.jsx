
import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
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
        const interval = setInterval(fetchData, 15000); // Refresh every 15s for live timers
        return () => clearInterval(interval);
    }, []);

    const onDragEnd = async (result) => {
        if (!result.destination) return;

        const { draggableId, destination } = result;
        const newStatusId = parseInt(destination.droppableId);

        try {
            await axios.post(`/tasks/${draggableId}/status`, {
                status_id: newStatusId
            });
            fetchData();
        } catch (err) {
            console.error('Status change failed:', err);
        }
    };

    const handlePickTask = () => {
        fetchData(); // Refresh board after pick
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
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
                            <Droppable droppableId={status.id.toString()}>
                                {(provided) => (
                                    <div ref={provided.innerRef} {...provided.droppableProps}>
                                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                            {column.name} ({column.tasks.length})
                                        </Typography>

                                        {column.tasks.map((task, index) => (
                                            <Draggable
                                                key={task.id}
                                                draggableId={task.id.toString()}
                                                index={index}
                                            >
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        <TaskCard task={task} onPickTask={handlePickTask} />
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </Paper>
                    );
                })}
            </Box>
        </DragDropContext>
    );
};

export default KanbanBoard;
