import Redis from 'ioredis';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = {
    runtime: 'nodejs',
};

let redis: Redis | null = null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Check Environment Variables
    if (!process.env['REDIS_URL']) {
        return res.status(500).json({ error: 'Missing REDIS_URL' });
    }

    // Connect if not connected
    if (!redis) {
        redis = new Redis(process.env['REDIS_URL']);
    }

    try {
        // 1. Set Admin Credentials
        // In a real app, password should be hashed. For MVP/POC, we store as plain text or simple hash.
        // User requested "Sandeep" and "some password".
        const adminCreds = {
            username: 'sandeep',
            password: 'admin_password_123' // Default password
        };
        await redis.set('admin:credentials', JSON.stringify(adminCreds));

        // 2. Migrate Data
        // Read existing data
        const existingData = await redis.get('roadmap_data_v3');

        if (existingData) {
            // Save to new project key
            await redis.set('roadmap_data:vision-2026', existingData);
            console.log('Migrated roadmap_data_v3 to roadmap_data:vision-2026');
        } else {
            console.log('No existing data found in roadmap_data_v3');
        }

        // 3. Create Default User for Vision 2026
        // This allows the admin to log in as a regular user too, or just a test user.
        // Let's create a user "sandeep" linked to "vision-2026"
        const user = {
            username: 'sandeep',
            password: 'password123',
            projectId: 'vision-2026'
        };
        await redis.set(`auth:user:${user.username}`, JSON.stringify(user));
        await redis.sadd(`project:${user.projectId}:users`, user.username);

        return res.status(200).json({
            success: true,
            message: 'Admin setup and migration complete',
            migrated: !!existingData,
            admin: adminCreds.username,
            defaultUser: user.username
        });

    } catch (error) {
        console.error('Setup Error:', error);
        return res.status(500).json({ error: 'Setup failed', details: String(error) });
    }
}
