import { Link } from 'react-router-dom';

/**
 * Application layout with navigation header.
 */
export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">ST</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">
                Support Tickets
              </span>
            </Link>
            <nav className="flex items-center gap-4">
              <Link
                to="/"
                className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors"
              >
                Dashboard
              </Link>
              <Link to="/tickets/new" className="btn-primary">
                + New Ticket
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
