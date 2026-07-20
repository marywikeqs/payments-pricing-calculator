import { getStore } from '@netlify/blobs';

// Appends one calculator estimate to the "estimates" blob store (one JSON blob per record).
export default async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  let rec;
  try { rec = await req.json(); }
  catch { return new Response('Invalid JSON body', { status: 400 }); }

  if (!rec || typeof rec !== 'object' || !rec.opportunityId) {
    return new Response('opportunityId is required', { status: 400 });
  }

  rec.loggedAt = new Date().toISOString();
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  rec.id = id;

  const store = getStore({ name: 'estimates', consistency: 'strong' });
  await store.setJSON(id, rec);

  return Response.json({ ok: true, id });
};
