import { ALL_STATUSES } from '../utils/constants';

/**
 * Search and filter controls for the ticket list.
 */
export default function TicketFilters({ filters, onFilterChange, onSearch }) {
  return (
    <div className="card p-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search tickets by keyword..."
            className="input"
            defaultValue={filters.search}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSearch(e.target.value);
            }}
          />
        </div>
        <select
          className="input sm:w-48"
          value={filters.status}
          onChange={(e) => onFilterChange({ status: e.target.value })}
        >
          <option value="">All Statuses</option>
          {ALL_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button
          className="btn-secondary"
          onClick={() => {
            const input = document.querySelector('input[placeholder*="Search"]');
            onSearch(input?.value || '');
          }}
        >
          Search
        </button>
      </div>
    </div>
  );
}
