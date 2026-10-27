import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { errMsg } from '../api';

export default function Login() {
  const { authenticate } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErr(''); setBusy(true);
    try { await authenticate(mode, form); }
    catch (x) { setErr(errMsg(x)); }
    setBusy(false);
  };

  return (
    <div className="login">
      <section className="hero">
        <div className="brand big"><span className="dot" />Staff<em>Sync</em></div>
        <h1>Run your team,<br /><i>not spreadsheets.</i></h1>
        <p>Headcount, time off and approvals in one clear place for your whole organisation.</p>
        <div className="float f3"><b>94%</b><small>attendance this week</small></div>
        <div className="float f2"><span className="pill ok">Approved</span><small>Leave request</small></div>
        <div className="float f1"><b>128</b><small>people onboarded</small></div>
      </section>
      <section className="formside">
        <form onSubmit={submit} className="card loginform">
          <h2>{mode === 'login' ? 'Welcome back' : 'Create your workspace'}</h2>
          <p className="muted">{mode === 'login' ? 'Sign in to continue.' : 'It takes ten seconds.'}</p>
          {mode === 'register' && <label>Full name<input required value={form.name} onChange={set('name')} placeholder="Your name" /></label>}
          <label>Email<input type="email" required value={form.email} onChange={set('email')} placeholder="you@company.com" /></label>
          <label>Password<input type="password" required value={form.password} onChange={set('password')} placeholder="At least 6 characters" /></label>
          {err && <div className="err">{err}</div>}
          <button className="btn" disabled={busy}>{busy ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}</button>
          <p className="switch">
            {mode === 'login' ? 'New here?' : 'Already have an account?'}{' '}
            <a onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setErr(''); }}>
              {mode === 'login' ? 'Create an account' : 'Sign in'}
            </a>
          </p>
        </form>
      </section>
    </div>
  );
}