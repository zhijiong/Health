module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  var URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  var TK = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!URL || !TK) return res.status(500).json({ error: 'Redis not configured', hint: Object.keys(process.env).filter(function(k){ return k.includes('UPSTASH') || k.includes('KV'); }).join(', ') || 'No matching env vars found' });

  var auth = { Authorization: 'Bearer ' + TK };

  try {
    if (req.method === 'GET') {
      var user = req.query.user;
      var week = req.query.week;
      if (!user || !week) return res.status(400).json(null);
      var r = await fetch(URL + '/get/mp_' + user + '_w' + week, { headers: auth });
      var d = await r.json();
      return res.json(d.result ? JSON.parse(d.result) : null);
    }

    if (req.method === 'POST') {
      var body = req.body;
      if (!body.user || !body.week || !body.data) return res.status(400).json({ error: 'Missing fields' });
      var val = JSON.stringify(body.data);
      var r2 = await fetch(URL, {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + TK, 'Content-Type': 'application/json' },
        body: JSON.stringify(['SET', 'mp_' + body.user + '_w' + body.week, val, 'EX', '1209600'])
      });
      var d2 = await r2.json();
      return res.json({ ok: d2.result === 'OK' });
    }

    return res.status(405).end();
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
