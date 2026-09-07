import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'PUT') {
      const { id, action } = req.body;
      const { data: rows, error: fetchErr } = await supabase
        .from('applications')
        .select('*')
        .eq('id', id)
        .single();
      if (fetchErr) throw fetchErr;
      const meta = rows.meta || {};
      const timeline = Array.isArray(meta.timeline) ? meta.timeline : [];
      const now = new Date().toISOString();
      const status = action === 'submit' ? 'In Progress' : action === 'track' ? 'Tracking' : rows.status;
      timeline.push({ date: now, text: action === 'submit' ? 'Application submitted' : action === 'track' ? 'Tracking activated' : 'Status updated' });
      const { data, error } = await supabase
        .from('applications')
        .update({ status, meta: { ...meta, timeline } })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return res.status(200).json(data);
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
