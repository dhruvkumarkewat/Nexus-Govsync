import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('demo_requests')
        .select('id')
        .order('created_at', { ascending: false })
        .limit(1);
      if (error) throw error;
      return res.status(200).json({ count: data.length > 0 ? data[0].id : 0 });
    }
    if (req.method === 'POST') {
      const { name, email, org, role, department, message } = req.body;
      const { data, error } = await supabase
        .from('demo_requests')
        .insert({ name, email, org, role, department, message })
        .select()
        .single();
      if (error) throw error;
      return res.status(201).json(data);
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
