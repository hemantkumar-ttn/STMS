import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTickets } from '../context/TicketContext';
import * as api from '../services/api';
import TicketForm from '../components/TicketForm';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';

/**
 * Edit Ticket page.
 */
export default function EditTicket() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { users, loading, error, fetchUsers, updateTicket, clearMessages } =
    useTickets();
  const [ticket, setTicket] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    if (users.length === 0) fetchUsers();
  }, [users.length, fetchUsers]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.getTicketById(id);
        setTicket(res.data.ticket);
      } catch (err) {
        setFetchError(err.message);
      } finally {
        setFetching(false);
      }
    };
    load();
  }, [id]);

  const handleSubmit = async (data) => {
    try {
      await updateTicket(id, data);
      navigate(`/tickets/${id}`);
    } catch {
      // Error handled by context
    }
  };

  if (fetching) return <Spinner />;
  if (fetchError) {
    return (
      <Alert type="error" message={fetchError} />
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link
          to={`/tickets/${id}`}
          className="text-sm text-primary-600 hover:text-primary-700"
        >
          &larr; Back to ticket
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Edit Ticket</h1>
      </div>

      {error && <Alert type="error" message={error} onClose={clearMessages} />}

      <TicketForm
        initialData={ticket}
        users={users}
        onSubmit={handleSubmit}
        submitLabel="Update Ticket"
        loading={loading}
      />
    </div>
  );
}
