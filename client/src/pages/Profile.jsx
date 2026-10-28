import { useEffect, useState } from 'react';
import api, { errMsg } from '../api';
import { useAuth } from '../context/AuthContext.jsx';
import { hue, inr } from './Dashboard.jsx';

export default function Profile() {
  const { user } = useAuth();
  const [emp, setEmp] = useState(undefined);
  const [phone, setPhone] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  useEffect(() => {
    api.get('/me').then((r) => { setEmp(r.data.employee); setPhone(r.data.employee?.phone || ''); }).catch(() => setEmp(null));
  }, []);

  const save = async (e) => {
    e.preventDefault(); setMsg(''); setErr('');
    try { const r = await api.put('/me', { phone }); setEmp(r.data.employee); setMsg('Saved.'); }
    catch (x) { setErr(errMsg(x)); }
  };

  if (emp === undefined) return <div className="loading">Loading your profile...</div>;

  return (
    <>
      <header className="page">
        <div><p className="eyebrow">Your record</p><h1>My <i>profile</i></h1></div>
      </header>

      {!emp ? (
        <div className="empty card"><h3>No record found</h3><p className="muted">HR has not added an employee record for {user.email} yet.</p></div>
      ) : (
        <form className="card" onSubmit={save} style={{ maxWidth: 680 }}>
          <div className="row" style={{ gap: 16, marginBottom: 24 }}>
            <div className="av lg" style={{ background: `hsl(${hue(emp.name)} 70% 88%)`, color: `hsl(${hue(emp.name)} 50% 25%)` }}>{emp.name[0]}</div>
            <div><h3 style={{ margin: 0 }}>{emp.name}</h3><p className="muted">{emp.position} · {emp.department}</p></div>
          </div>
          <div className="kv">
            <div><small>Email</small><b>{emp.email}</b></div>
            <div><small>Status</small><b>{emp.status}</b></div>
            <div><small>Joined</small><b>{new Date(emp.joinDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</b></div>
            <div><small>Salary</small><b>{inr(emp.salary)} / yr</b></div>
          </div>
          <label style={{ marginTop: 24 }}>Phone (you can edit this)
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Your phone number" />
          </label>
          {err && <div className="err" style={{ marginTop: 14 }}>{err}</div>}
          {msg && <div className="pill ok" style={{ marginTop: 14 }}>{msg}</div>}
          <div style={{ marginTop: 20 }}><button className="btn">Save changes</button></div>
        </form>
      )}
    </>
  );
}