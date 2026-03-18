import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { table, data } = req.body;

    if (!table || !data || !['funds_btg', 'funds_xp'].includes(table)) {
      return res.status(400).json({ error: 'Invalid table or data' });
    }

    const supa = createClient(
      'https://qlyceionzyuaaajwqniy.supabase.co',
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Delete all existing records
    await supa.from(table).delete().neq('id', 0);

    // Insert new data
    const { error } = await supa.from(table).insert({
      data: data,
      uploaded_at: new Date().toISOString()
    });

    if (error) throw error;

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('save-funds error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
