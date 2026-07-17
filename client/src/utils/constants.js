/**
 * Allowed status transitions (mirrors backend logic).
 */
export const STATUS_TRANSITIONS = {
  Open: ['In Progress', 'Cancelled'],
  'In Progress': ['Resolved', 'Cancelled'],
  Resolved: ['Closed'],
  Closed: [],
  Cancelled: [],
};

export const ALL_STATUSES = Object.keys(STATUS_TRANSITIONS);

export const ALL_PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];

/**
 * Get the list of statuses a ticket can transition to.
 */
export const getAllowedTransitions = (currentStatus) =>
  STATUS_TRANSITIONS[currentStatus] || [];

/**
 * Status badge color mapping.
 */
export const STATUS_COLORS = {
  Open: 'bg-blue-100 text-blue-800',
  'In Progress': 'bg-yellow-100 text-yellow-800',
  Resolved: 'bg-green-100 text-green-800',
  Closed: 'bg-gray-100 text-gray-800',
  Cancelled: 'bg-red-100 text-red-800',
};

export const PRIORITY_COLORS = {
  Low: 'bg-gray-100 text-gray-700',
  Medium: 'bg-blue-100 text-blue-700',
  High: 'bg-orange-100 text-orange-700',
  Critical: 'bg-red-100 text-red-700',
};
