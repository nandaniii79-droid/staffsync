import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Layout from './components/Layout.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Home from './pages/Home.jsx';
import Employees from './pages/Employees.jsx';
import Leaves from './pages/Leaves.jsx';
import Attendance from './pages/Attendance.jsx';
import Announcements from './pages/Announcements.jsx';
import Training from './pages/Training.jsx';
import Profile from './pages/Profile.jsx';

function Protected({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

function Index() {
  const { user } = useAuth();
  return user.role === 'employee' ? <Home /> : <Dashboard />;
}

export default function App() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route element={<Protected><Layout /></Protected>}>
        <Route path="/" element={<Index />} />
        <Route path="/employees" element={<Protected roles={['hr', 'manager']}><Employees /></Protected>} />
        <Route path="/leaves" element={<Leaves />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/training" element={<Training />} />
        <Route path="/profile" element={<Protected roles={['manager', 'employee']}><Profile /></Protected>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}