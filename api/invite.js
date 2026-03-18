import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({ error: 'SUPABASE_SERVICE_ROLE_KEY not configured' });
  }

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const supa = createClient(
      'https://qlyceionzyuaaajwqniy.supabase.co',
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data, error } = await supa.auth.admin.inviteUserByEmail(email, {
      redirectTo: 'https://app.openadvisor.com.br/Consultor'
    });

    if (error) throw error;

    return res.status(200).json({ success: true, user: data?.user?.id });
  } catch (error) {
    console.error('invite error:', error);
    return res.status(500).json({ error: error.message || 'Failed to send invite' });
  }
}
