import { kv } from '@vercel/kv';

export const config = {
    runtime: 'edge',
};

export default async function handler(request: Request) {
    const url = new URL(request.url);
    const key = 'roadmap_data_v3';

    if (request.method === 'GET') {
        try {
            const data = await kv.get(key);
            return new Response(JSON.stringify(data || null), {
                status: 200,
                headers: { 'content-type': 'application/json' },
            });
        } catch (error) {
            return new Response(JSON.stringify({ error: 'Failed to load data' }), { status: 500 });
        }
    }

    if (request.method === 'POST') {
        try {
            const body = await request.json();
            await kv.set(key, body);
            return new Response(JSON.stringify({ success: true }), {
                status: 200,
                headers: { 'content-type': 'application/json' },
            });
        } catch (error) {
            return new Response(JSON.stringify({ error: 'Failed to save data' }), { status: 500 });
        }
    }

    return new Response('Method not allowed', { status: 405 });
}
