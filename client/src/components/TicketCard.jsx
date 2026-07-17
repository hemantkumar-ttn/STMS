import { Link } from 'react-router-dom';
import { StatusBadge, PriorityBadge } from './Badge';

/**
 * Empty state placeholder when no tickets match filters.
 */
export function EmptyState({ message = 'No tickets found' }) {
  return (
    <div className="card p-12 text-center">
      <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <p className="text-gray-500 text-sm">{message}</p>
      <Link to="/tickets/new" className="btn-primary mt-4 inline-flex">
        Create your first ticket
      </Link>
    </div>
  );
}

/**
 * Single ticket row in the list view.
 */
export function TicketRow({ ticket }) {
  const assignee = ticket.assignedTo?.name || 'Unassigned';
  const creator = ticket.createdBy?.name || 'Unknown';

  return (
    <Link
      to={`/tickets/${ticket._id}`}
      className="card p-4 hover:shadow-md transition-shadow block"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 truncate">
            {ticket.title}
          </h3>
          <p className="text-xs text-gray-500 mt-1 line-clamp-1">
            {ticket.description}
          </p>
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
            <span>By {creator}</span>
            <span>&middot;</span>
            <span>Assigned to {assignee}</span>
            <span>&middot;</span>
            <span>{new Date(ticket.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <PriorityBadge priority={ticket.priority} />
          <StatusBadge status={ticket.status} />
        </div>
      </div>
    </Link>
  );
}
