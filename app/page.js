import { db } from '@/lib/supabase';
import Calculator from './Calculator';

export const dynamic = 'force-dynamic';
const money = (n) => '$' + Number(n).toFixed(2);

export default async function Home() {
  let checks = [], loadError = null;
  try {
    const { data, error } = await db().from('checks').select('*').order('created_at', { ascending: false }).limit(20);
    if (error) throw error;
    checks = data;
  } catch (e) { console.error(e); loadError = 'Could not load past checks.'; }

  return (
    <main>
      <h1>Split the Check</h1>
      <p className="sub">Enter the bill, pick a tip, see what everyone owes</p>
      <Calculator />
      <section>
        <h2>Past checks</h2>
        {loadError && <p className="err">{loadError}</p>}
        {!loadError && checks.length === 0 && <p className="muted">No checks yet. Hit "Paid in full" to save one.</p>}
        <ul className="history">
          {checks.map((c) => (
            <li key={c.id} className="card row">
              <div>
                <strong>{c.label || 'Check'}</strong>
                <div className="muted">{new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · {c.people} {c.people === 1 ? 'person' : 'people'} · {c.tip_pct}% tip</div>
              </div>
              <div className="right">
                <div>{money(c.total)}</div>
                <div className="muted">{money(c.per_person)} each</div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
