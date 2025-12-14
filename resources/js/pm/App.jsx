import { useEffect, useState } from "react";
import axios from "../lib/axios";
import Login from "./pages/Login";
import KanbanBoard from "./pages/KanbanBoard";

export default function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("/api/me")
            .then(res => setUser(res.data))
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>Loading...</p>;

    if (!user) {
        return <Login onLogin={setUser} />;
    }

    return <KanbanBoard user={user} />;
}

// import React from 'react';
// import KanbanBoard from './KanbanBoard';

// export default function App() {
//   return (
//     <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
//       <aside style={{ width: 220, background: '#1f2937', color: '#fff', padding: 16 }}>
//         <h3>Project Manager</h3>
//         <p>Kanban</p>
//       </aside>

//       <main style={{ flex: 1, padding: 16, background: '#f3f4f6' }}>
//         <KanbanBoard />
//       </main>
//     </div>
//   );
// }
