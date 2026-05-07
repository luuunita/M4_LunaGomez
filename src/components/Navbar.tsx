import type { User } from 'firebase/auth';
import { Link } from 'react-router-dom';

interface NavbarProps {
  user: User | null;
  onLogout: () => Promise<void>;
}

function Navbar({ user, onLogout }: NavbarProps) {
  return (
    <nav className="topbar">
      <div className="brand-mark">
        <span className="brand-dot" />
        <span>TaskFlow</span>
      </div>

      <div className="nav-links">
        <Link to="/">Inicio</Link>
        <Link to="/tasks">Tareas</Link>
        <Link to="/about">Acerca de</Link>
      </div>

      <div className="nav-actions">
        {user ? (
          <button type="button" onClick={() => void onLogout()}>
            Cerrar sesion
          </button>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Registro</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;




