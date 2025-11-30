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

    const { username, password, projectId } = req.body;

    if (!username || !password || !projectId) {
        return res.status(400).json({ error: 'Missing required fields' });
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
        const storedUser = await redis.get(`auth:user:${username}`);

        if (!storedUser) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = JSON.parse(storedUser);

        if (user.password === password && user.projectId === projectId) {
            // Success
            return res.status(200).json({
                success: true,
                user: {
                    username: user.username,
                    projectId: user.projectId
                }
            });
        } else {
            return res.status(401).json({ error: 'Invalid credentials or Project ID' });
        }

    } catch (error) {
        console.error('Login Error:', error);
        return res.status(500).json({ error: 'Login failed', details: String(error) });
    }
}
