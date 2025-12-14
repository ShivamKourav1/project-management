
import React, { useState } from 'react';

export default function Filters({ onChange }) {
  const [local, setLocal] = useState({});

  const update = (key, value) => {
    const updated = { ...local, [key]: value };
    setLocal(updated);
    onChange(updated);
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <select onChange={e => update('severity_id', e.target.value)}>
        <option value="">Severity</option>
        <option value="1">Blocker</option>
        <option value="2">Critical</option>
        <option value="3">Major</option>
      </select>

      <select onChange={e => update('deadline', e.target.value)}>
        <option value="">Deadline</option>
        <option value="overdue">Overdue</option>
        <option value="today">Today</option>
      </select>
    </div>
  );
}
