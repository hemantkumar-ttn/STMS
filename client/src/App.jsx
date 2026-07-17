import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TicketProvider } from './context/TicketContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CreateTicket from './pages/CreateTicket';
import EditTicket from './pages/EditTicket';
import TicketDetails from './pages/TicketDetails';

export default function App() {
  return (
    <BrowserRouter>
      <TicketProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tickets/new" element={<CreateTicket />} />
            <Route path="/tickets/:id" element={<TicketDetails />} />
            <Route path="/tickets/:id/edit" element={<EditTicket />} />
          </Routes>
        </Layout>
      </TicketProvider>
    </BrowserRouter>
  );
}
