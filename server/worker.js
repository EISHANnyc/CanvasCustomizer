// server/worker.js - Cloudflare Worker for CanvasCustomizer Anonymous Palette Telemetry
export default {
  async fetch(request, env, ctx) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);

    // Root status
    if (url.pathname === '/' || url.pathname === '/health') {
      return new Response(JSON.stringify({ status: 'ok', service: 'CanvasCustomizer Telemetry API', timestamp: Date.now() }), {
        headers: corsHeaders
      });
    }

    // POST /api/palette-choice - Record an anonymous palette application
    if (url.pathname === '/api/palette-choice' && request.method === 'POST') {
      try {
        const body = await request.json();
        const palette = body && body.palette ? String(body.palette).trim().substring(0, 50) : null;
        if (!palette) {
          return new Response(JSON.stringify({ error: 'Missing palette name' }), { status: 400, headers: corsHeaders });
        }

        // Increment in KV if bound
        if (env.PALETTE_KV) {
          const currentCount = parseInt(await env.PALETTE_KV.get(palette) || '0', 10);
          await env.PALETTE_KV.put(palette, String(currentCount + 1));
          const totalCount = parseInt(await env.PALETTE_KV.get('__TOTAL__') || '0', 10);
          await env.PALETTE_KV.put('__TOTAL__', String(totalCount + 1));
        }

        return new Response(JSON.stringify({ ok: true, palette, recordedAt: Date.now() }), {
          headers: corsHeaders
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
      }
    }

    // GET /api/palette-stats - Get community palette popularity
    if (url.pathname === '/api/palette-stats' && request.method === 'GET') {
      try {
        let stats = { total: 0, rankings: [] };
        if (env.PALETTE_KV) {
          const list = await env.PALETTE_KV.list();
          let items = [];
          let total = 0;
          for (const key of list.keys) {
            if (key.name === '__TOTAL__') {
              total = parseInt(await env.PALETTE_KV.get(key.name) || '0', 10);
            } else {
              const count = parseInt(await env.PALETTE_KV.get(key.name) || '0', 10);
              items.push({ palette: key.name, count });
            }
          }
          items.sort((a, b) => b.count - a.count);
          stats = { total, rankings: items };
        } else {
          // Demo fallback rankings
          stats = {
            total: 154,
            rankings: [
              { palette: 'Coastline', count: 52 },
              { palette: 'Matcha Latte', count: 38 },
              { palette: 'Terracotta Sun', count: 29 },
              { palette: 'Midnight Plum', count: 21 },
              { palette: 'Nordic Slate', count: 14 }
            ]
          };
        }
        return new Response(JSON.stringify(stats), { headers: corsHeaders });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
      }
    }

    return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers: corsHeaders });
  }
};
