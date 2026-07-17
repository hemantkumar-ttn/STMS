import { createContext, useContext, useReducer, useCallback } from 'react';
import * as api from '../services/api';

const TicketContext = createContext(null);

const initialState = {
  tickets: [],
  users: [],
  currentUser: null,
  pagination: { total: 0, page: 1, limit: 20, pages: 0 },
  filters: { status: '', search: '' },
  loading: false,
  error: null,
  successMessage: null,
};

function ticketReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload, error: null };
    case 'SET_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'SET_SUCCESS':
      return { ...state, loading: false, successMessage: action.payload, error: null };
    case 'CLEAR_MESSAGES':
      return { ...state, error: null, successMessage: null };
    case 'SET_TICKETS':
      return {
        ...state,
        loading: false,
        tickets: action.payload.data,
        pagination: action.payload.pagination,
      };
    case 'SET_USERS':
      return { ...state, users: action.payload };
    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.payload };
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'REMOVE_TICKET':
      return {
        ...state,
        tickets: state.tickets.filter((t) => t._id !== action.payload),
      };
    default:
      return state;
  }
}

export function TicketProvider({ children }) {
  const [state, dispatch] = useReducer(ticketReducer, initialState);

  const clearMessages = useCallback(() => {
    dispatch({ type: 'CLEAR_MESSAGES' });
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await api.getUsers();
      dispatch({ type: 'SET_USERS', payload: res.data });
      // Default to first agent/admin user for demo purposes
      const defaultUser =
        res.data.find((u) => u.role === 'agent') || res.data[0];
      if (defaultUser) {
        dispatch({ type: 'SET_CURRENT_USER', payload: defaultUser });
      }
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
    }
  }, []);

  const fetchTickets = useCallback(
    async (overrides = {}) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const params = { ...state.filters, ...overrides };
        const res = await api.getTickets(params);
        dispatch({ type: 'SET_TICKETS', payload: res });
      } catch (err) {
        dispatch({ type: 'SET_ERROR', payload: err.message });
      }
    },
    [state.filters]
  );

  const setFilters = useCallback((filters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  }, []);

  const createTicket = useCallback(async (data) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const res = await api.createTicket(data);
      dispatch({ type: 'SET_SUCCESS', payload: 'Ticket created successfully' });
      return res.data;
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
      throw err;
    }
  }, []);

  const updateTicket = useCallback(async (id, data) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const res = await api.updateTicket(id, data);
      dispatch({ type: 'SET_SUCCESS', payload: 'Ticket updated successfully' });
      return res.data;
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
      throw err;
    }
  }, []);

  const updateStatus = useCallback(async (id, status) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const res = await api.updateTicketStatus(id, status);
      dispatch({ type: 'SET_SUCCESS', payload: `Status changed to ${status}` });
      return res.data;
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
      throw err;
    }
  }, []);

  const deleteTicket = useCallback(async (id) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await api.deleteTicket(id);
      dispatch({ type: 'REMOVE_TICKET', payload: id });
      dispatch({ type: 'SET_SUCCESS', payload: 'Ticket deleted successfully' });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
      throw err;
    }
  }, []);

  const addComment = useCallback(async (ticketId, data) => {
    try {
      const res = await api.addComment(ticketId, data);
      dispatch({ type: 'SET_SUCCESS', payload: 'Comment added successfully' });
      return res.data;
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
      throw err;
    }
  }, []);

  const value = {
    ...state,
    fetchUsers,
    fetchTickets,
    setFilters,
    createTicket,
    updateTicket,
    updateStatus,
    deleteTicket,
    addComment,
    clearMessages,
  };

  return (
    <TicketContext.Provider value={value}>{children}</TicketContext.Provider>
  );
}

export function useTickets() {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error('useTickets must be used within a TicketProvider');
  }
  return context;
}
