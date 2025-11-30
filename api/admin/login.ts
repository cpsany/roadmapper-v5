import Redis from 'ioredis';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = {
    runtime: 'nodejs',
};

let redis: Redis | null = null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Missing username or password' });
    }

    // Check Environment Variables
    if (!process.env['REDIS_URL']) {
        return res.status(500).json({ error: 'Missing REDIS_URL' });
    }

    // Connect if not connected
    if (!redis) {
        redis = new Redis(process.env['REDIS_URL']);
    }

    try {
        const storedCreds = await redis.get('admin:credentials');

        if (!storedCreds) {
            return res.status(401).json({ error: 'Admin not initialized. Run /api/admin/setup first.' });
        }

        const admin = JSON.parse(storedCreds);

        if (username === admin.username && password === admin.password) {
            // Success
            return res.status(200).json({
                success: true,
                token: 'admin-token-mock', // In real app, use JWT
                username: admin.username
            });
        } else {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

    } catch (error) {
        console.error('Admin Login Error:', error);
        return res.status(500).json({ error: 'Login failed', details: String(error) });
    }
}
