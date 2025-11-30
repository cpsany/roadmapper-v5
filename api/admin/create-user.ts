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
        // Check if user already exists
        const existingUser = await redis.get(`auth:user:${username}`);
        if (existingUser) {
            return res.status(409).json({ error: 'User already exists' });
        }

        const newUser = {
            username,
            password,
            projectId
        };

        // Save user
        await redis.set(`auth:user:${username}`, JSON.stringify(newUser));

        // Add to project's user list
        await redis.sadd(`project:${projectId}:users`, username);

        return res.status(200).json({ success: true, user: newUser });

    } catch (error) {
        console.error('Create User Error:', error);
        return res.status(500).json({ error: 'Failed to create user', details: String(error) });
    }
}
