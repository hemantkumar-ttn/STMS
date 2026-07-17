import { STATUS_COLORS, PRIORITY_COLORS } from '../utils/constants';

/**
 * Status badge with color coding.
 */
export function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[status] || 'bg-gray-100 text-gray-800'}`}
    >
      {status}
    </span>
  );
}

/**
 * Priority badge with color coding.
 */
export function PriorityBadge({ priority }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${PRIORITY_COLORS[priority] || 'bg-gray-100 text-gray-800'}`}
    >
      {priority}
    </span>
  );
}
