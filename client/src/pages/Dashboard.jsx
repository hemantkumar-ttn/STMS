import { useEffect } from 'react';
import { useTickets } from '../context/TicketContext';
import TicketFilters from '../components/TicketFilters';
import { TicketRow, EmptyState } from '../components/TicketCard';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';

/**
 * Dashboard page — ticket list with search and status filter.
 */
export default function Dashboard() {
  const {
    tickets,
    filters,
    loading,
    error,
    successMessage,
    pagination,
    fetchTickets,
    setFilters,
    clearMessages,
  } = useTickets();

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleFilterChange = (newFilters) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    fetchTickets(updated);
  };

  const handleSearch = (search) => {
    const updated = { ...filters, search };
    setFilters(updated);
    fetchTickets(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tickets</h1>
          <p className="text-sm text-gray-500 mt-1">
            {pagination.total} ticket{pagination.total !== 1 ? 's' : ''} total
          </p>
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={clearMessages} />}
      {successMessage && (
        <Alert type="success" message={successMessage} onClose={clearMessages} />
      )}

      <TicketFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
      />

      {loading ? (
        <Spinner />
      ) : tickets.length === 0 ? (
        <EmptyState
          message={
            filters.search || filters.status
              ? 'No tickets match your filters'
              : 'No tickets found'
          }
        />
      ) : (
        <div className="space-y-3">
          {tickets.map((ticket) => (
            <TicketRow key={ticket._id} ticket={ticket} />
          ))}
        </div>
      )}
    </div>
  );
}
