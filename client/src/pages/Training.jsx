import { useEffect, useState } from 'react';
import api, { errMsg } from '../api';
import Modal from '../components/Modal.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const DEPTS = ['All', 'Engineering', 'Design', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'];
const blank = { title: '', description: '', date: new Date().toISOString().slice(0, 10), mode: 'Online', department: 'All' };

export default function Training() {
  const { user } = useAuth();
  const canManage = user.role === 'hr' || user.role === 'manager';
  const [list, setList] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(blank);
  const [err, setErr] = useState('');

  const load = () => api.get('/training').then((r) => setList(r.data));
  useEffect(() => { load(); }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault(); setErr('');
    try { await api.post('/training', form); setModal(false); setForm(blank); load(); }
    catch (x) { setErr(errMsg(x)); }
  };

  const remove = async (id) => { if (confirm('Delete this program?')) { await api.delete(`/training/${id}`); load(); } };

  const startToday = new Date(); startToday.setHours(0, 0, 0, 0);

  return (
    <>
      <header className="page">
        <div><p className="eyebrow">Learning</p><h1>Training <i>programs</i></h1></div>
        {canManage && <button className="btn" onClick={() => { setErr(''); setModal(true); }}>+ New program</button>}
      </header>

      {list.length === 0 ? (
        <div className="empty card"><h3>No programs yet</h3><p className="muted">{canManage ? 'Create the first training program.' : 'Nothing has been assigned to you.'}</p></div>
      ) : (
        <div className="people">
          {list.map((t) => {
            const past = new Date(t.date) < startToday;
            return (
              <article className="card person" key={t._id} style={{ opacity: past ? 0.6 : 1 }}>
                <span className={`pill ${past ? 'wait' : 'ok'}`}>{past ? 'Completed' : 'Upcoming'}</span>
                <h3 style={{ marginTop: 28 }}>{t.title}</h3>
                <p className="muted">{t.description || 'No description.'}</p>
                <div className="meta">
                  <span>{new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  <span>{t.mode} · {t.department === 'All' ? 'All departments' : t.department}</span>
                  <span>Created by {t.createdBy}</span>
                </div>
                {canManage && <div className="actions"><button className="mini danger" onClick={() => remove(t._id)}>Delete</button></div>}
              </article>
            );
          })}
        </div>
      )}

      {modal && (
        <Modal title="New training program" onClose={() => setModal(false)}>
          <form onSubmit={submit} className="form2">
            <label className="full">Title<input required value={form.title} onChange={set('title')} /></label>
            <label className="full">Description<textarea rows="3" value={form.description} onChange={set('description')} /></label>
            <label>Date<input type="date" required value={form.date} onChange={set('date')} /></label>
            <label>Mode
              <select value={form.mode} onChange={set('mode')}><option>Online</option><option>In person</option></select>
            </label>
            <label className="full">For department
              <select value={form.department} onChange={set('department')}>{DEPTS.map((d) => <option key={d}>{d}</option>)}</select>
            </label>
            {err && <div className="err full">{err}</div>}
            <button className="btn full">Create program</button>
          </form>
        </Modal>
      )}
    </>
  );
}