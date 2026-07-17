/**
 * Valid ticket status transitions.
 * Open -> In Progress | Cancelled
 * In Progress -> Resolved | Cancelled
 * Resolved -> Closed
 */
const VALID_TRANSITIONS = {
  Open: ['In Progress', 'Cancelled'],
  'In Progress': ['Resolved', 'Cancelled'],
  Resolved: ['Closed'],
  Closed: [],
  Cancelled: [],
};

const ALL_STATUSES = Object.keys(VALID_TRANSITIONS);

/**
 * Check whether a status transition is allowed.
 * @param {string} currentStatus
 * @param {string} newStatus
 * @returns {boolean}
 */
const isValidTransition = (currentStatus, newStatus) => {
  if (currentStatus === newStatus) return true;
  const allowed = VALID_TRANSITIONS[currentStatus] || [];
  return allowed.includes(newStatus);
};

/**
 * Get human-readable error message for invalid transitions.
 */
const getTransitionErrorMessage = (currentStatus, newStatus) => {
  const allowed = VALID_TRANSITIONS[currentStatus] || [];
  if (allowed.length === 0) {
    return `Cannot change status from "${currentStatus}" — ticket is in a terminal state.`;
  }
  return `Invalid status transition from "${currentStatus}" to "${newStatus}". Allowed: ${allowed.join(', ')}.`;
};

module.exports = {
  VALID_TRANSITIONS,
  ALL_STATUSES,
  isValidTransition,
  getTransitionErrorMessage,
};
