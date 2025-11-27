import { kv } from '@vercel/kv';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = {
    runtime: 'nodejs',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const key = 'roadmap_data_v3';

    // Check Environment Variables
    if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
        console.error('Missing Vercel KV environment variables');
        return res.status(500).json({
            error: 'Missing Vercel KV environment variables',
            details: 'Please connect a KV database in Vercel settings.'
        });
    }

    if (req.method === 'GET') {
        try {
            const data = await kv.get(key);
            return res.status(200).json(data || null);
        } catch (error) {
            console.error('KV GET Error:', error);
            return res.status(500).json({ error: 'Failed to load data', details: String(error) });
        }
    }

    if (req.method === 'POST') {
        try {
            const body = req.body;
            await kv.set(key, body);
            return res.status(200).json({ success: true });
        } catch (error) {
            console.error('KV POST Error:', error);
            return res.status(500).json({ error: 'Failed to save data', details: String(error) });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
