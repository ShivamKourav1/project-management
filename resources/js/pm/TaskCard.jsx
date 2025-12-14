
import React from 'react';
import axios from './axios';

export default function TaskCard({ task }) {

  const pickTask = () => {
    axios.post(`/api/tasks/${task.id}/pick`);
  };

  return (
    <div
      onClick={pickTask}
      style={{
        background: '#fff',
        padding: 12,
        marginBottom: 8,
        borderRadius: 6,
        cursor: 'pointer'
      }}
    >
      <strong>{task.title}</strong>

      <div style={{ fontSize: 12, marginTop: 4 }}>
        {task.severity && (
          <span style={{ color: task.severity.color }}>
            {task.severity.name}
          </span>
        )}
      </div>

      {task.started_at && (
        <div style={{ fontSize: 11, color: 'green' }}>
          ⏱ Working
        </div>
      )}
    </div>
  );
}
