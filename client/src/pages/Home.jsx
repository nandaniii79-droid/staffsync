import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext.jsx';

export default function Home() {
  const { user } = useAuth();
  const [s, setS] = useState(null);

  useEffect(() => { api.get('/me/summary').then((r) => setS(r.data)).catch(() => {}); }, []);
  if (!s) return <div className="loading">Loading your overview...</div>;

  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const cards = [
    { label: 'Attendance today', value: s.today ? s.today.status : 'Not marked', tone: s.today ? 'sky' : 'coral' },
    { label: 'Pending leaves', value: s.leaves.Pending, tone: 'lime' },
    { label: 'Approved leaves', value: s.leaves.Approved, tone: 'sky' },
    { label: 'Rejected leaves', value: s.leaves.Rejected, tone: 'ink' },
  ];

  return (
    <>
      <header className="page">
        <div>
          <p className="eyebrow">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          <h1>{greet}, <i>{user.name.split(' ')[0]}.</i></h1>
        </div>
        {!s.today && <Link to="/attendance" className="btn">Mark attendance</Link>}
      </header>

      <div className="stats">
        {cards.map((c) => (
          <div key={c.label} className={`stat ${c.tone}`}>
            <small>{c.label}</small>
            <b style={{ fontSize: typeof c.value === 'string' ? '1.6rem' : undefined }}>{c.value}</b>
          </div>
        ))}
      </div>

      <div className="grid2">
        <section className="card">
          <div className="row between"><h3>Latest announcements</h3><Link to="/announcements" className="link">View all</Link></div>
          {s.announcements.length === 0 && <p className="muted">No announcements yet.</p>}
          {s.announcements.map((a) => (
            <div className="li" key={a._id}>
              <div><b>{a.title}</b><small>{new Date(a.createdAt).toLocaleDateString('en-IN')} · {a.author}</small></div>
            </div>
          ))}
        </section>

        <section className="card">
          <div className="row between"><h3>Upcoming training</h3><Link to="/training" className="link">View all</Link></div>
          {s.trainings.length === 0 && <p className="muted">Nothing scheduled.</p>}
          {s.trainings.map((t) => (
            <div className="li" key={t._id}>
              <div><b>{t.title}</b><small>{new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} · {t.mode}</small></div>
              <span className="pill info">{t.department}</span>
            </div>
          ))}
        </section>
      </div>
    </>
  );
}