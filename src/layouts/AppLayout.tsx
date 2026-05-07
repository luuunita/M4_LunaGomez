import type { User } from 'firebase/auth';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

interface AppLayoutProps {
  user: User | null;
  onLogout: () => Promise<void>;
}

function AppLayout({ user, onLogout }: AppLayoutProps) {
  return (
    <main className="app-shell">
      <Navbar user={user} onLogout={onLogout} />
      <section className="page-shell">
        <Outlet />
      </section>
    </main>
  );
}

export default AppLayout;

