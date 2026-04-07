export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const TK = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!URL || !TK) return res.status(500).json({ error: 'Redis not configured' });

  const auth = { Authorization: `Bearer ${TK}` };

  try {
    if (req.method === 'GET') {
      const { user, week } = req.query;
      if (!user || !week) return res.status(400).json(null);
      const r = await fetch(`${URL}/get/mp_${user}_w${week}`, { headers: auth });
      const d = await r.json();
      return res.json(d.result ? JSON.parse(d.result) : null);
    }

    if (req.method === 'POST') {
      const { user, week, data } = req.body;
      if (!user || !week || !data) return res.status(400).json({ error: 'Missing fields' });
      const r = await fetch(URL, {
        method: 'POST',
        headers: { ...auth, 'Content-Type': 'application/json' },
        body: JSON.stringify(['SET', `mp_${user}_w${week}`, JSON.stringify(data), 'EX', '1209600'])
      });
      const d = await r.json();
      return res.json({ ok: d.result === 'OK' });
    }

    return res.status(405).end();
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
