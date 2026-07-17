import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTickets } from '../context/TicketContext';
import * as api from '../services/api';
import { StatusBadge, PriorityBadge } from '../components/Badge';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';
import { getAllowedTransitions } from '../utils/constants';

/**
 * Ticket Details page with comments and status management.
 */
export default function TicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    currentUser,
    loading,
    error,
    successMessage,
    fetchUsers,
    updateStatus,
    deleteTicket,
    addComment,
    clearMessages,
  } = useTickets();

  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  const loadTicket = async () => {
    try {
      const res = await api.getTicketById(id);
      setTicket(res.data.ticket);
      setComments(res.data.comments);
    } catch (err) {
      setFetchError(err.message);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    loadTicket();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleStatusChange = async (newStatus) => {
    try {
      const updated = await updateStatus(id, newStatus);
      setTicket(updated);
    } catch {
      // Error handled by context
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this ticket?')) return;
    try {
      await deleteTicket(id);
      navigate('/');
    } catch {
      // Error handled by context
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmittingComment(true);
    try {
      const comment = await addComment(id, {
        message: commentText,
        createdBy: currentUser?._id,
      });
      setComments((prev) => [...prev, comment]);
      setCommentText('');
    } catch {
      // Error handled by context
    } finally {
      setSubmittingComment(false);
    }
  };

  if (fetching) return <Spinner />;
  if (fetchError) return <Alert type="error" message={fetchError} />;
  if (!ticket) return <Alert type="error" message="Ticket not found" />;

  const allowedTransitions = getAllowedTransitions(ticket.status);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <Link to="/" className="text-sm text-primary-600 hover:text-primary-700">
            &larr; Back to dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">{ticket.title}</h1>
          <div className="flex items-center gap-2 mt-2">
            <StatusBadge status={ticket.status} />
            <PriorityBadge priority={ticket.priority} />
          </div>
        </div>
        <div className="flex gap-2">
          <Link to={`/tickets/${id}/edit`} className="btn-secondary">
            Edit
          </Link>
          <button onClick={handleDelete} className="btn-danger">
            Delete
          </button>
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={clearMessages} />}
      {successMessage && (
        <Alert type="success" message={successMessage} onClose={clearMessages} />
      )}

      {/* Ticket details */}
      <div className="card p-6 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Description</h3>
          <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
            {ticket.description}
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-500">Created By</p>
            <p className="text-sm font-medium">{ticket.createdBy?.name || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Assigned To</p>
            <p className="text-sm font-medium">
              {ticket.assignedTo?.name || 'Unassigned'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Created</p>
            <p className="text-sm font-medium">
              {new Date(ticket.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Last Updated</p>
            <p className="text-sm font-medium">
              {new Date(ticket.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Status transitions */}
      {allowedTransitions.length > 0 && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Change Status</h3>
          <div className="flex flex-wrap gap-2">
            {allowedTransitions.map((status) => (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                disabled={loading}
                className="btn-secondary text-xs"
              >
                &rarr; {status}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Comments section */}
      <div className="card p-6">
        <h3 className="text-sm font-medium text-gray-700 mb-4">
          Comments ({comments.length})
        </h3>

        {comments.length === 0 ? (
          <p className="text-sm text-gray-500 mb-4">No comments yet.</p>
        ) : (
          <div className="space-y-4 mb-6">
            {comments.map((comment) => (
              <div
                key={comment._id}
                className="border-l-2 border-primary-200 pl-4 py-1"
              >
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="font-medium text-gray-700">
                    {comment.createdBy?.name || 'Unknown'}
                  </span>
                  <span>&middot;</span>
                  <span>{new Date(comment.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-sm text-gray-900 mt-1 whitespace-pre-wrap">
                  {comment.message}
                </p>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleAddComment} className="space-y-3">
          <textarea
            className="input min-h-[80px]"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            maxLength={2000}
            required
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="btn-primary"
              disabled={submittingComment || !commentText.trim()}
            >
              {submittingComment ? 'Posting...' : 'Add Comment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
