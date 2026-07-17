import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTickets } from '../context/TicketContext';
import TicketForm from '../components/TicketForm';
import Alert from '../components/Alert';

/**
 * Create Ticket page.
 */
export default function CreateTicket() {
  const navigate = useNavigate();
  const {
    users,
    currentUser,
    loading,
    error,
    fetchUsers,
    createTicket,
    clearMessages,
  } = useTickets();

  useEffect(() => {
    if (users.length === 0) fetchUsers();
  }, [users.length, fetchUsers]);

  const handleSubmit = async (data) => {
    try {
      const ticket = await createTicket({
        ...data,
        createdBy: currentUser?._id,
      });
      navigate(`/tickets/${ticket._id}`);
    } catch {
      // Error handled by context
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create Ticket</h1>
        <p className="text-sm text-gray-500 mt-1">
          Submit a new support request
        </p>
      </div>

      {error && <Alert type="error" message={error} onClose={clearMessages} />}

      <TicketForm
        users={users}
        onSubmit={handleSubmit}
        submitLabel="Create Ticket"
        loading={loading}
      />
    </div>
  );
}
