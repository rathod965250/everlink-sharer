export const config = { runtime: 'edge' };

const SUPABASE_URL = 'https://fqaneqqwdsmlfsbhtixq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxYW5lcXF3ZHNtbGZzYmh0aXhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyMTc0ODIsImV4cCI6MjA3MTc5MzQ4Mn0.lwZ-Z-OA1ZLf_gobrZkCYBriR-Ec5UUMRpT_cyux2jQ';

export default async function handler(req: Request) {
  try {
    const url = new URL(req.url);
    const code = url.pathname.split('/').pop() || '';

    if (!code) {
      return new Response('Missing code', { status: 400 });
    }

    // Fetch the link data
    const linkRes = await fetch(
      `${SUPABASE_URL}/rest/v1/links?select=original_url,expires_at,clicks&short_code=eq.${encodeURIComponent(code)}&limit=1`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          Accept: 'application/json',
        },
        // Edge runtime defaults to GET
      }
    );

    if (!linkRes.ok) {
      return new Response('Not found', { status: 404 });
    }

    const rows = (await linkRes.json()) as Array<{ original_url: string; expires_at: string | null; clicks: number | null }>;
    const link = rows?.[0];

    if (!link) {
      return new Response('Not found', { status: 404 });
    }

    // Check expiration
    if (link.expires_at && new Date(link.expires_at) < new Date()) {
      return new Response('Link expired', { status: 410 });
    }

    const location = link.original_url;

    // Fire-and-forget click increment (do not await)
    fetch(`${SUPABASE_URL}/rest/v1/links?short_code=eq.${encodeURIComponent(code)}`, {
      method: 'PATCH',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({ clicks: (link.clicks || 0) + 1 }),
    }).catch(() => {});

    // Perform an immediate redirect with no body
    return new Response(null, {
      status: 308, // Permanent Redirect (keeps method-safe and is cacheable)
      headers: {
        Location: location,
        'Cache-Control': 'public, max-age=60',
      },
    });
  } catch (e) {
    return new Response('Server error', { status: 500 });
  }
}
