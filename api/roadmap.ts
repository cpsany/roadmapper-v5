import { kv } from '@vercel/kv';

export default async function handler(request: Request) {
    const url = new URL(request.url);
    const key = 'roadmap_data_v3';

    if (!process.env['KV_REST_API_URL'] || !process.env['KV_REST_API_TOKEN']) {
        console.error('Missing Vercel KV environment variables');
        return new Response(JSON.stringify({
            error: 'Missing Vercel KV environment variables',
            details: 'Please connect a KV database in Vercel settings.'
        }), { status: 500 });
    }

    if (request.method === 'GET') {
        try {
            const data = await kv.get(key);
            return new Response(JSON.stringify(data || null), {
                status: 200,
                headers: { 'content-type': 'application/json' },
            });
        } catch (error) {
            console.error('KV GET Error:', error);
            return new Response(JSON.stringify({ error: 'Failed to load data', details: String(error) }), { status: 500 });
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
            console.error('KV POST Error:', error);
            return new Response(JSON.stringify({ error: 'Failed to save data', details: String(error) }), { status: 500 });
        }
    }

    return new Response('Method not allowed', { status: 405 });
}
