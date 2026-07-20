import { getStore } from '@netlify/blobs';

// Fixed column order so the CSV is stable for reconciliation in Excel.
const COLUMNS = [
  'loggedAt', 'opportunityId', 'gpvMode', 'totalGpv', 'cpGpv', 'cnpGpv',
  'industry', 'country', 'currency', 'pricingModel', 'brand', 'month',
  'rate_inStore_vmd_pct', 'fee_inStore_vmd', 'rate_inStore_amex_pct', 'fee_inStore_amex',
  'rate_inStore_interac_pct', 'fee_inStore_interac',
  'rate_online_vmd_pct', 'fee_online_vmd', 'rate_online_amex_pct', 'fee_online_amex',
  'icPlus_monthlyFee', 'icPlus_inStore_pct', 'icPlus_inStore_fee', 'icPlus_online_pct', 'icPlus_online_fee',
  'cash_pct', 'cash_fee',
  'out_MRR', 'out_ARR', 'out_effectiveTakeRate', 'out_NRM', 'out_adjGpv', 'out_impliedTxns',
  'id'
];

const esc = (v) => {
  const s = (v === null || v === undefined) ? '' : String(v);
  return /[",\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
};

export default async (req) => {
  const expected = process.env.EXPORT_KEY;
  if (!expected) {
    return new Response('EXPORT_KEY is not configured. Set it in Netlify: Site configuration → Environment variables.', { status: 503 });
  }
  const key = new URL(req.url).searchParams.get('key');
  if (key !== expected) return new Response('Unauthorized', { status: 401 });

  const store = getStore({ name: 'estimates', consistency: 'strong' });
  const { blobs } = await store.list();

  const rows = [];
  for (const b of blobs) {
    const rec = await store.get(b.key, { type: 'json' });
    if (rec) rows.push(rec);
  }
  rows.sort((a, b) => String(a.loggedAt || '').localeCompare(String(b.loggedAt || '')));

  const lines = [COLUMNS.join(',')];
  for (const r of rows) lines.push(COLUMNS.map((c) => esc(r[c])).join(','));
  const csv = '﻿' + lines.join('\r\n'); // BOM so Excel reads UTF-8 correctly

  return new Response(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="payments-estimates.csv"',
      'Cache-Control': 'no-store'
    }
  });
};
