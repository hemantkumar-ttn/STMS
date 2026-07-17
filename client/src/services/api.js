import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Response interceptor for consistent error extraction
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

/**
 * Remove empty string / null / undefined values from query params.
 * Ensures "All Statuses" (empty status) fetches all tickets.
 */
const cleanParams = (params = {}) =>
  Object.fromEntries(
    Object.entries(params).filter(([, value]) => value != null && value !== '')
  );

// --- Tickets ---

export const getTickets = (params = {}) =>
  api.get('/tickets', { params: cleanParams(params) }).then((res) => res.data);

export const getTicketById = (id) =>
  api.get(`/tickets/${id}`).then((res) => res.data);

export const createTicket = (data) =>
  api.post('/tickets', data).then((res) => res.data);

export const updateTicket = (id, data) =>
  api.put(`/tickets/${id}`, data).then((res) => res.data);

export const updateTicketStatus = (id, status) =>
  api.patch(`/tickets/${id}/status`, { status }).then((res) => res.data);

export const deleteTicket = (id) =>
  api.delete(`/tickets/${id}`).then((res) => res.data);

// --- Comments ---

export const getComments = (ticketId) =>
  api.get(`/tickets/${ticketId}/comments`).then((res) => res.data);

export const addComment = (ticketId, data) =>
  api.post(`/tickets/${ticketId}/comments`, data).then((res) => res.data);

// --- Users ---

export const getUsers = () => api.get('/users').then((res) => res.data);

export default api;
