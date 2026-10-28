import { useEffect, useState } from 'react';
import api, { errMsg } from '../api';
import Modal from '../components/Modal.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { hue } from './Dashboard.jsx';

const today = () => new Date().toISOString().slice(0, 10);
const days = (a, b) => Math.round((new Date(b) - new Date(a)) / 864e5) + 1;
const fmt = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

export default function Leaves() {
  const { user } = useAuth();
  const isHr = user.role === 'hr';
  const canDecide = user.role === 'hr' || user.role === 'manager';

  const [leaves, setLeaves] = useState([]);
  const [emps, setEmps] = useState([]);
  const [tab, setTab] = useState('All');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ employee: '', type: 'Casual', from: today(), to: today(), reason: '' });
  const [err, setErr] = useState('');

  const load = () => api.get('/leaves').then((r) => setLeaves(r.data));
  useEffect(() => {
    load();
    if (isHr) api.get('/employees').then((r) => setEmps(r.data));
  }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault(); setErr('');
    try { await api.post('/leaves', form); setModal(false); load(); }
    catch (x) { setErr(errMsg(x)); }
  };

  const decide = async (id, status) => {
    try { await api.patch(`/leaves/${id}/status`, { status }); load(); }
    catch (x) { alert(errMsg(x)); }
  };
  const remove = async (id) => { if (confirm('Delete this request?')) { await api.delete(`/leaves/${id}`); load(); } };

  const shown = leaves.filter((l) => tab === 'All' || l.status === tab);
  const cls = { Pending: 'wait', Approved: 'ok', Rejected: 'bad' };
  const title = canDecide ? <>Leave <i>requests</i></> : <>My <i>leaves</i></>;

  return (
    <>
      <header className="page">
        <div><p className="eyebrow">Time off</p><h1>{title}</h1></div>
        <button
          className="btn"
          onClick={() => { setErr(''); setForm({ ...form, employee: emps[0]?._id || '' }); setModal(true); }}
          disabled={isHr && !emps.length}
        >
          + New request
        </button>
      </header>

      <div className="tabs" style={{ marginBottom: 18 }}>
        {['All', 'Pending', 'Approved', 'Rejected'].map((t) => (
          <button key={t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>
            {t} {t !== 'All' && <small>({leaves.filter((l) => l.status === t).length})</small>}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <div className="empty card"><h3>Nothing to show</h3><p className="muted">No requests in this view.</p></div>
      ) : (
        <div className="stack">
          {shown.map((l) => (
            <div className="leave card" key={l._id}>
              <div className="av" style={{ background: `hsl(${hue(l.employee?.name)} 70% 88%)`, color: `hsl(${hue(l.employee?.name)} 50% 25%)` }}>{l.employee?.name?.[0] || '?'}</div>
              <div className="grow">
                <b>{l.employee?.name || 'Removed employee'}</b>
                <small>{l.employee?.department} · {l.type} leave</small>
                {l.reason && <p className="muted">"{l.reason}"</p>}
              </div>
              <div className="dates">
                <b>{fmt(l.from)} to {fmt(l.to)}</b>
                <small>{days(l.from, l.to)} day{days(l.from, l.to) > 1 ? 's' : ''}</small>
              </div>
              <span className={`pill ${cls[l.status]}`}>{l.status}</span>
              {canDecide && (
                <div className="actions">
                  {l.status === 'Pending' ? (
                    <>
                      <button className="mini okb" onClick={() => decide(l._id, 'Approved')}>Approve</button>
                      <button className="mini danger" onClick={() => decide(l._id, 'Rejected')}>Reject</button>
                    </>
                  ) : (
                    <button className="mini danger" onClick={() => remove(l._id)}>Delete</button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {modal && (
        <Modal title="New leave request" onClose={() => setModal(false)}>
          <form onSubmit={submit} className="form2">
            {isHr && (
              <label className="full">Employee
                <select required value={form.employee} onChange={set('employee')}>
                  {emps.map((e) => <option key={e._id} value={e._id}>{e.name} ({e.department})</option>)}
                </select>
              </label>
            )}
            <label>Type
              <select value={form.type} onChange={set('type')}><option>Casual</option><option>Sick</option><option>Paid</option><option>Unpaid</option></select>
            </label>
            <span />
            <label>From<input type="date" required value={form.from} onChange={set('from')} /></label>
            <label>To<input type="date" required value={form.to} onChange={set('to')} /></label>
            <label className="full">Reason<textarea rows="3" value={form.reason} onChange={set('reason')} /></label>
            {err && <div className="err full">{err}</div>}
            <button className="btn full">Submit request</button>
          </form>
        </Modal>
      )}
    </>
  );
}