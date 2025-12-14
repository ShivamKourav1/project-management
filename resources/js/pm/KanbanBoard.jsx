import { useEffect, useState } from "react";
import axios from "../../lib/axios";

export default function KanbanBoard({ user }) {
    const [statuses, setStatuses] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            axios.get("/api/statuses"),
            axios.get("/api/tasks")
        ])
            .then(([statusesRes, tasksRes]) => {
                setStatuses(statusesRes.data);
                setTasks(tasksRes.data);
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <p>Loading board...</p>;
    }

    return (
        <div style={{ padding: 20 }}>
            <h1>Project Management Dashboard</h1>
            <p>Logged in as: <strong>{user.name}</strong></p>

            <div style={{ display: "flex", gap: 16, marginTop: 20 }}>
                {statuses.map(status => (
                    <div
                        key={status.id}
                        style={{
                            border: "1px solid #ccc",
                            padding: 10,
                            width: 250
                        }}
                    >
                        <h3>{status.name}</h3>

                        {tasks
                            .filter(task => task.status_id === status.id)
                            .map(task => (
                                <div
                                    key={task.id}
                                    style={{
                                        background: "#f5f5f5",
                                        padding: 8,
                                        marginBottom: 8
                                    }}
                                >
                                    <strong>{task.title}</strong>
                                    <br />
                                    <small>Assignee: {task.assignee?.name ?? "Unassigned"}</small>
                                </div>
                            ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
