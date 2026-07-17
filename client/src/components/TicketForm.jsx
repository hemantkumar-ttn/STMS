import { useState } from 'react';
import { ALL_PRIORITIES } from '../utils/constants';

/**
 * Reusable ticket form for create and edit pages.
 */
export default function TicketForm({
  initialData = {},
  users = [],
  onSubmit,
  submitLabel = 'Save Ticket',
  loading = false,
}) {
  const [form, setForm] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    priority: initialData.priority || 'Medium',
    assignedTo: initialData.assignedTo?._id || initialData.assignedTo || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...form,
      assignedTo: form.assignedTo || null,
    };
    onSubmit(data);
  };

  const agents = users.filter((u) => u.role === 'agent' || u.role === 'admin');

  return (
    <form onSubmit={handleSubmit} className="card p-6 space-y-5">
      <div>
        <label htmlFor="title" className="label">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          className="input"
          value={form.title}
          onChange={handleChange}
          required
          maxLength={200}
          placeholder="Brief summary of the issue"
        />
      </div>

      <div>
        <label htmlFor="description" className="label">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          className="input min-h-[120px]"
          value={form.description}
          onChange={handleChange}
          required
          maxLength={5000}
          placeholder="Detailed description of the issue"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="priority" className="label">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            className="input"
            value={form.priority}
            onChange={handleChange}
          >
            {ALL_PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="assignedTo" className="label">
            Assign To
          </label>
          <select
            id="assignedTo"
            name="assignedTo"
            className="input"
            value={form.assignedTo}
            onChange={handleChange}
          >
            <option value="">Unassigned</option>
            {agents.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name} ({u.role})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
