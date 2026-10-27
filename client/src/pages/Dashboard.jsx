import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext.jsx';

export const hue = (s = '') => [...s].reduce((a, c) => a + c.charCodeAt(0), 0) * 37 % 360;
export const inr = (n) => '₹' + Number(n || 0).toLocaleString('en-IN');

export default function Dashboard() {
  const { user } = useAuth();
  const [s, setS] = useState(null);

  useEffect(() => { api.get('/stats').then((r) => setS(r.data)).catch(() => {}); }, []);
  if (!s) return <div className="loading">Loading your overview...</div>;

  const max = Math.max(1, ...s.departments.map((d) => d.count));
  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const cards = [
    { label: 'Total people', value: s.total, tone: 'lime' },
    { label: 'Departments', value: s.departments.length, tone: 'sky' },
    { label: 'Pending requests', value: s.pending, tone: 'coral' },
    { label: 'Avg. salary', value: inr(s.avgSalary), tone: 'ink' },
  ];

  return (
    <>
      <header className="page">
        <div>
          <p className="eyebrow">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          <h1>{greet}, <i>{user.name.split(' ')[0]}.</i></h1>
        </div>
        <Link to="/employees" className="btn">+ Add person</Link>
      </header>

      <div className="stats">
        {cards.map((c) => (
          <div key={c.label} className={`stat ${c.tone}`}>
            <small>{c.label}</small>
            <b>{c.value}</b>
          </div>
        ))}
      </div>

      <div className="grid2">
        <section className="card">
          <h3>Team by department</h3>
          {s.departments.length === 0 && <p className="muted">No data yet. Add your first employee.</p>}
          {s.departments.map((d, i) => (
            <div className="bar" key={d.name}>
              <span>{d.name}</span>
              <div className="track"><div className="fill" style={{ width: `${(d.count / max) * 100}%`, animationDelay: `${i * 80}ms` }} /></div>
              <b>{d.count}</b>
            </div>
          ))}
        </section>

        <section className="card">
          <div className="row between"><h3>Awaiting approval</h3><Link to="/leaves" className="link">View all</Link></div>
          {s.pendingList.length === 0 && <p className="muted">All caught up.</p>}
          {s.pendingList.map((l) => (
            <div className="li" key={l._id}>
              <div className="av sm" style={{ background: `hsl(${hue(l.employee?.name)} 70% 88%)`, color: `hsl(${hue(l.employee?.name)} 50% 25%)` }}>{l.employee?.name?.[0]}</div>
              <div><b>{l.employee?.name}</b><small>{l.type} · {new Date(l.from).toLocaleDateString('en-IN')}</small></div>
              <span className="pill wait">Pending</span>
            </div>
          ))}
        </section>
      </div>

      <section className="card" style={{ marginTop: 20 }}>
        <h3>Recently joined</h3>
        {s.recent.length === 0 && <p className="muted">Nobody yet.</p>}
        <div className="chips">
          {s.recent.map((e) => (
            <div className="chip" key={e._id}>
              <div className="av sm" style={{ background: `hsl(${hue(e.name)} 70% 88%)`, color: `hsl(${hue(e.name)} 50% 25%)` }}>{e.name[0]}</div>
              <div><b>{e.name}</b><small>{e.position}</small></div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}