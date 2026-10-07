'use server';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/supabase';

const TIPS = [15, 18, 20, 25];

export async function saveCheck(input) {
  const bill = Number(input?.bill);
  const tipPct = Number(input?.tipPct);
  const people = Number(input?.people);
  const label = String(input?.label ?? '').trim().slice(0, 80);

  if (!Number.isFinite(bill) || bill <= 0 || bill > 100000) return { error: 'Enter a bill between $0.01 and $100,000.' };
  if (!TIPS.includes(tipPct)) return { error: 'Pick a tip.' };
  if (!Number.isInteger(people) || people < 1 || people > 100) return { error: 'People must be 1–100.' };

  // Recalculate on the server so saved numbers can't be faked from the browser.
  const tip = Math.round(bill * tipPct) / 100;
  const total = Math.round((bill + tip) * 100) / 100;
  const each = Math.ceil((total / people) * 100) / 100;

  const { error } = await db().from('checks').insert({
    label: label || null, bill, tip_pct: tipPct, people, tip, total, per_person: each,
  });
  if (error) { console.error(error); return { error: 'Could not save. Try again.' }; }
  revalidatePath('/');
  return { ok: true };
}
