'use client';
import { useState, useTransition } from 'react';
import { saveCheck } from './actions';

const TIPS = [15, 18, 20, 25];
const money = (n) => '$' + (Number.isFinite(n) ? n : 0).toFixed(2);

export default function Calculator() {
  const [bill, setBill] = useState('');
  const [tipPct, setTipPct] = useState(18);
  const [people, setPeople] = useState('2');
  const [label, setLabel] = useState('');
  const [msg, setMsg] = useState(null);
  const [pending, start] = useTransition();

  const b = parseFloat(bill) || 0;
  const p = parseInt(people, 10) || 0;
  const tip = Math.round(b * tipPct) / 100;
  const total = b + tip;
  const each = p > 0 ? Math.ceil((total / p) * 100) / 100 : 0;

  const clear = () => { setBill(''); setTipPct(18); setPeople('2'); setLabel(''); setMsg(null); };

  const paid = () => start(async () => {
    const res = await saveCheck({ bill: b, tipPct, people: p, label });
    if (res?.error) setMsg({ err: true, text: res.error });
    else { clear(); setMsg({ text: 'Saved to past checks ✓' }); }
  });

  return (
    <section className="card">
      <label>Bill $
        <input inputMode="decimal" placeholder="0.00" value={bill}
          onChange={(e) => setBill(e.target.value.replace(/[^0-9.]/g, ''))} />
      </label>
      <div className="tips">
        {TIPS.map((t) => (
          <button key={t} type="button" className={t === tipPct ? 'tip on' : 'tip'} onClick={() => setTipPct(t)}>{t}%</button>
        ))}
      </div>
      <label>People
        <input inputMode="numeric" value={people}
          onChange={(e) => setPeople(e.target.value.replace(/[^0-9]/g, ''))} />
      </label>
      <label>What was it? <span className="muted">(optional)</span>
        <input placeholder="Dinner at Carbone" maxLength={80} value={label} onChange={(e) => setLabel(e.target.value)} />
      </label>
      <dl className="totals">
        <div><dt>Tip</dt><dd>{money(tip)}</dd></div>
        <div><dt>Total</dt><dd>{money(total)}</dd></div>
        <div className="each"><dt>Each person pays</dt><dd>{money(each)}</dd></div>
      </dl>
      <div className="actions">
        <button type="button" className="primary" disabled={pending || b <= 0 || p < 1} onClick={paid}>
          {pending ? 'Saving…' : 'Paid in full'}
        </button>
        <button type="button" className="ghost" onClick={clear}>Clear the check</button>
      </div>
      {msg && <p className={msg.err ? 'err' : 'ok'}>{msg.text}</p>}
    </section>
  );
}
