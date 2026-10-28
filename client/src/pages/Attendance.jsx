import { useEffect, useState } from 'react';
import api, { errMsg } from '../api';
import { useAuth } from '../context/AuthContext.jsx';

const cls = { Present: 'ok', Remote: 'info', 'Half Day': 'wait', Absent: 'bad' };
const todayStr = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });

export default function Attendance() {
  const { user } = useAuth();
  const mine = user.role !== 'hr';
  const team = user.role !== 'employee';

  const [hist, setHist] = useState([]);
  const [date, setDate] = useState(todayStr());
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState('');

  const loadMine = () => api.get('/attendance/me').then((r) => setHist(r.data));
  const loadTeam = () => api.get('/attendance', { params: { date } }).then((r) => setRows(r.data.rows));

  useEffect(() => { if (mine) loadMine(); }, []);
  useEffect(() => { if (team) loadTeam(); }, [date]);

  const mark = async (status) => {
    setErr('');
    try { await api.post('/attendance/mark', { status }); loadMine(); if (team) loadTeam(); }
    catch (x) { setErr(errMsg(x)); }
  };

  const doneToday = hist.find((h) => h.date === todayStr());
  const present = rows.filter((r) => r.status !== 'Absent').length;

  return (
    <>
      <header className="page">
        <div><p className="eyebrow">Daily check-in</p><h1>Atten<i>dance</i></h1></div>
      </header>

      {mine && (
        <section className="card" style={{ marginBottom: 22 }}>
          <h3>Today, {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</h3>
          {doneToday ? (
            <p>You are marked <span className={`pill ${cls[doneToday.status]}`}>{doneToday.status}</span> since {new Date(doneToday.checkIn).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}.</p>
          ) : (
            <>
              <p className="muted" style={{ marginBottom: 14 }}>You have not marked attendance yet.</p>
              <div className="markrow">
                <button className="btn" onClick={() => mark('Present')}>Present</button>
                <button className="mini" onClick={() => mark('Remote')}>Working remotely</button>
                <button className="mini" onClick={() => mark('Half Day')}>Half day</button>
              </div>
            </>
          )}
          {err && <div className="err" style={{ marginTop: 14 }}>{err}</div>}

          <h3 style={{ marginTop: 26 }}>My last 30 days</h3>
          {hist.length === 0 ? <p className="muted">No records yet.</p> : (
            <table className="tbl">
              <thead><tr><th>Date</th><th>Status</th><th>Time</th></tr></thead>
              <tbody>
                {hist.map((h) => (
                  <tr key={h._id}>
                    <td>{new Date(h.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</td>
                    <td><span className={`pill ${cls[h.status]}`}>{h.status}</span></td>
                    <td>{new Date(h.checkIn).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      )}

      {team && (
        <section className="card">
          <div className="row between" style={{ flexWrap: 'wrap', gap: 12, marginBottom: 12 }}>
            <h3 style={{ margin: 0 }}>Team attendance</h3>
            <div className="row" style={{ gap: 12 }}>
              <small>{present} of {rows.length} present</small>
              <input type="date" value={date} max={todayStr()} onChange={(e) => setDate(e.target.value)} style={{ width: 'auto' }} />
            </div>
          </div>
          {rows.length === 0 ? <p className="muted">No employees yet.</p> : (
            <table className="tbl">
              <thead><tr><th>Name</th><th>Department</th><th>Status</th><th>Time</th></tr></thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.employee._id}>
                    <td><b>{r.employee.name}</b></td>
                    <td>{r.employee.department}</td>
                    <td><span className={`pill ${cls[r.status]}`}>{r.status}</span></td>
                    <td>{r.checkIn ? new Date(r.checkIn).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      )}
    </>
  );
}