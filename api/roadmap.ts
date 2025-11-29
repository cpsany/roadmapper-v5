import Redis from 'ioredis';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = {
    runtime: 'nodejs',
};

// Initialize Redis client outside handler to reuse connection
let redis: Redis | null = null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const key = 'roadmap_data_v3';

    // Check Environment Variables
    if (!process.env['REDIS_URL']) {
        console.error('Missing REDIS_URL environment variable');
        return res.status(500).json({
            error: 'Missing Redis environment variable',
            details: 'Please ensure REDIS_URL is set in Vercel settings.'
        });
    }

    // Connect if not connected
    if (!redis) {
        try {
            redis = new Redis(process.env['REDIS_URL']);
        } catch (error) {
            console.error('Redis Connection Error:', error);
            return res.status(500).json({ error: 'Failed to connect to Redis', details: String(error) });
        }
    }

    if (req.method === 'GET') {
        try {
            const data = await redis.get(key);
            return res.status(200).json(data ? JSON.parse(data) : null);
        } catch (error) {
            console.error('Redis GET Error:', error);
            return res.status(500).json({ error: 'Failed to load data', details: String(error) });
        }
    }

    if (req.method === 'POST') {
        try {
            const body = req.body;
            // Redis stores strings, so we must stringify the JSON body
            await redis.set(key, JSON.stringify(body));
            return res.status(200).json({ success: true });
        } catch (error) {
            console.error('Redis POST Error:', error);
            return res.status(500).json({ error: 'Failed to save data', details: String(error) });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
