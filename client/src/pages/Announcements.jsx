import { useEffect, useState } from 'react';
import api, { errMsg } from '../api';
import Modal from '../components/Modal.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Announcements() {
  const { user } = useAuth();
  const isHr = user.role === 'hr';
  const [list, setList] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ title: '', body: '' });
  const [err, setErr] = useState('');

  const load = () => api.get('/announcements').then((r) => setList(r.data));
  useEffect(() => { load(); }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault(); setErr('');
    try { await api.post('/announcements', form); setModal(false); setForm({ title: '', body: '' }); load(); }
    catch (x) { setErr(errMsg(x)); }
  };

  const remove = async (id) => { if (confirm('Delete this announcement?')) { await api.delete(`/announcements/${id}`); load(); } };

  return (
    <>
      <header className="page">
        <div><p className="eyebrow">Company news</p><h1>Announce<i>ments</i></h1></div>
        {isHr && <button className="btn" onClick={() => { setErr(''); setModal(true); }}>+ Post announcement</button>}
      </header>

      {list.length === 0 ? (
        <div className="empty card"><h3>No announcements yet</h3><p className="muted">{isHr ? 'Post the first one for your team.' : 'Check back later.'}</p></div>
      ) : (
        <div className="stack">
          {list.map((a) => (
            <article className="card ann" key={a._id}>
              <div className="row between">
                <h3>{a.title}</h3>
                {isHr && <button className="mini danger" onClick={() => remove(a._id)}>Delete</button>}
              </div>
              <p>{a.body}</p>
              <small className="when">Posted by {a.author} on {new Date(a.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</small>
            </article>
          ))}
        </div>
      )}

      {modal && (
        <Modal title="Post an announcement" onClose={() => setModal(false)}>
          <form onSubmit={submit} className="form2">
            <label className="full">Title<input required value={form.title} onChange={set('title')} /></label>
            <label className="full">Message<textarea required rows="5" value={form.body} onChange={set('body')} /></label>
            {err && <div className="err full">{err}</div>}
            <button className="btn full">Publish</button>
          </form>
        </Modal>
      )}
    </>
  );
}