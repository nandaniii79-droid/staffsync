import { useEffect, useState } from 'react';
import api, { errMsg } from '../api';
import Modal from '../components/Modal.jsx';
import { hue, inr } from './Dashboard.jsx';

const DEPTS = ['Engineering', 'Design', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'];
const blank = { name: '', email: '', phone: '', position: '', department: 'Engineering', salary: '', status: 'Active', joinDate: new Date().toISOString().slice(0, 10) };

export default function Employees() {
  const [list, setList] = useState([]);
  const [q, setQ] = useState('');
  const [dept, setDept] = useState('All');
  const [modal, setModal] = useState(null);
  const [err, setErr] = useState('');

  const load = () => api.get('/employees', { params: { q, department: dept } }).then((r) => setList(r.data));
  useEffect(() => { const t = setTimeout(load, 250); return () => clearTimeout(t); }, [q, dept]);

  const set = (k) => (e) => setModal({ ...modal, [k]: e.target.value });

  const save = async (e) => {
    e.preventDefault(); setErr('');
    const { _id, createdAt, updatedAt, __v, ...body } = modal;
    body.salary = Number(body.salary) || 0;
    try {
      _id ? await api.put(`/employees/${_id}`, body) : await api.post('/employees', body);
      setModal(null); load();
    } catch (x) { setErr(errMsg(x)); }
  };

  const remove = async (id) => {
    if (!confirm('Remove this person and their leave history?')) return;
    await api.delete(`/employees/${id}`); load();
  };

  return (
    <>
      <header className="page">
        <div><p className="eyebrow">Directory</p><h1>Your <i>people</i></h1></div>
        <button className="btn" onClick={() => { setErr(''); setModal(blank); }}>+ Add person</button>
      </header>

      <div className="toolbar">
        <input className="search" placeholder="Search name, email or role..." value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="tabs">
          {['All', ...DEPTS].map((d) => (
            <button key={d} className={dept === d ? 'on' : ''} onClick={() => setDept(d)}>{d}</button>
          ))}
        </div>
      </div>

      {list.length === 0 ? (
        <div className="empty card"><h3>No one here yet</h3><p className="muted">Add your first team member to get started.</p></div>
      ) : (
        <div className="people">
          {list.map((e) => (
            <article className="person card" key={e._id}>
              <div className="av lg" style={{ background: `hsl(${hue(e.name)} 70% 88%)`, color: `hsl(${hue(e.name)} 50% 25%)` }}>{e.name[0]}</div>
              <span className={`pill ${e.status === 'Active' ? 'ok' : e.status === 'Remote' ? 'info' : 'wait'}`}>{e.status}</span>
              <h3>{e.name}</h3>
              <p className="muted">{e.position} · {e.department}</p>
              <div className="meta">
                <span>{e.email}</span>
                {e.phone && <span>{e.phone}</span>}
                <span>{inr(e.salary)} / yr</span>
              </div>
              <div className="actions">
                <button className="mini" onClick={() => { setErr(''); setModal({ ...e, joinDate: e.joinDate?.slice(0, 10) }); }}>Edit</button>
                <button className="mini danger" onClick={() => remove(e._id)}>Delete</button>
              </div>
            </article>
          ))}
        </div>
      )}

      {modal && (
        <Modal title={modal._id ? 'Edit person' : 'Add a person'} onClose={() => setModal(null)}>
          <form onSubmit={save} className="form2">
            <label>Full name<input required value={modal.name} onChange={set('name')} /></label>
            <label>Email<input type="email" required value={modal.email} onChange={set('email')} /></label>
            <label>Phone<input value={modal.phone || ''} onChange={set('phone')} /></label>
            <label>Position<input required value={modal.position} onChange={set('position')} /></label>
            <label>Department
              <select value={modal.department} onChange={set('department')}>{DEPTS.map((d) => <option key={d}>{d}</option>)}</select>
            </label>
            <label>Status
              <select value={modal.status} onChange={set('status')}><option>Active</option><option>Remote</option><option>On Leave</option></select>
            </label>
            <label>Salary (INR per year)<input type="number" min="0" value={modal.salary} onChange={set('salary')} /></label>
            <label>Join date<input type="date" value={modal.joinDate} onChange={set('joinDate')} /></label>
            {err && <div className="err full">{err}</div>}
            <button className="btn full">{modal._id ? 'Save changes' : 'Add person'}</button>
          </form>
        </Modal>
      )}
    </>
  );
}