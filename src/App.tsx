import { Route, Routes } from 'react-router-dom';
import RequireAuth from './components/RequireAuth';
import { useAuth } from './features/auth/Authenticator';
import AppLayout from './layouts/AppLayout';
import About from './pages/About';
import Home from './pages/Home';
import Login from './pages/Login';
import Tasks from './pages/Tasks';
import Register from './pages/Register';


function App() {
  const { user, logout } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={<AppLayout user={user} onLogout={logout} />}
      >
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        <Route
          path="tasks"
          element={
            <RequireAuth>
              <Tasks />
            </RequireAuth>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;





