import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Svg = ({ children }) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

const icons = {
  grid: (<Svg><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></Svg>),
  people: (<Svg><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" /><circle cx="17.5" cy="9" r="2.5" /><path d="M18 14.2c2.2.3 3.5 2.2 3.5 4.8" /></Svg>),
  calendar: (<Svg><rect x="3" y="5" width="18" height="16" rx="2.5" /><path d="M3 10h18M8 3v4M16 3v4" /></Svg>),
  clock: (<Svg><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Svg>),
  mega: (<Svg><path d="M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1z" /><path d="M15 9a4 4 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11" /></Svg>),
  book: (<Svg><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5z" /><path d="M4 21.5V4.5" /></Svg>),
  user: (<Svg><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" /></Svg>),
  logout: (<Svg><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5M21 12H9" /></Svg>),
};

const links = [
  { to: '/', label: 'Overview', icon: icons.grid, end: true },
  { to: '/employees', label: 'People', icon: icons.people, roles: ['hr', 'manager'] },
  { to: '/leaves', label: 'Time off', icon: icons.calendar },
  { to: '/attendance', label: 'Attendance', icon: icons.clock },
  { to: '/announcements', label: 'Announcements', icon: icons.mega },
  { to: '/training', label: 'Training', icon: icons.book },
  { to: '/profile', label: 'My profile', icon: icons.user, roles: ['manager', 'employee'] },
];

const roleLabel = { hr: 'HR', manager: 'Manager', employee: 'Employee' };

export default function Layout() {
  const { user, logout } = useAuth();
  const visible = links.filter((l) => !l.roles || l.roles.includes(user.role));
  return (
    <div className="app">
      <aside className="side">
        <div className="brand"><span className="dot" />Staff<em>Sync</em></div>
        <nav>
          {visible.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => 'nav' + (isActive ? ' on' : '')}>
              <span className="ico">{l.icon}</span>{l.label}
            </NavLink>
          ))}
        </nav>
        <div className="me">
          <div className="av" style={{ background: '#e0e7ff', color: '#4f46e5' }}>{user.name[0].toUpperCase()}</div>
          <div><b>{user.name}</b><small>{roleLabel[user.role] || user.role}</small></div>
          <button className="ghost" onClick={logout} title="Log out" aria-label="Log out">{icons.logout}</button>
        </div>
      </aside>
      <main className="main"><Outlet /></main>
    </div>
  );
}