// canvaid/api/proxy.ts
// This file should be in the `canvaid/api/` directory, NOT `canvaid/src/api/`
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  // FIX: The original path is now in req.query.path
  // The rewrite rule in vercel.json makes everything after `/api-proxy/` 
  // available as a `path` query parameter.
  const path = req.query.path as string | string[];
  const canvasApiPath = Array.isArray(path) ? path.join('/') : path;

  // Reconstruct the query string if it exists
  const searchParams = new URL(req.url!, `http://${req.headers.host}`).search;
  const fullPath = `/${canvasApiPath}${searchParams}`;

  const canvasHost = req.headers['x-canvas-host'];
  const authorization = req.headers['authorization'];

  if (!canvasHost) {
    return res.status(400).json({ error: "Missing X-Canvas-Host header." });
  }
  if (!authorization) {
    return res.status(401).json({ error: "Missing Authorization header." });
  }

  try {
    const targetUrl = `${canvasHost}${fullPath}`;
    
    // Log the target URL for debugging in Vercel
    console.log(`Proxying request to: ${targetUrl}`);

    const canvasResponse = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Authorization': authorization,
        // Forward any other relevant headers if necessary
      },
      // Vercel handles body parsing, so we pass it directly
      body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : null,
    });

    // To properly handle all response types (JSON, text, etc.),
    // we stream the response back.
    res.status(canvasResponse.status);
    canvasResponse.headers.forEach((value, key) => {
        // Avoid setting headers that Vercel controls
        if (key.toLowerCase() !== 'content-encoding' && key.toLowerCase() !== 'transfer-encoding') {
            res.setHeader(key, value);
        }
    });

    const responseBody = await canvasResponse.arrayBuffer();
    res.send(Buffer.from(responseBody));

  } catch (error) {
    console.error('Error in Vercel proxy function:', error);
    res.status(500).json({ error: 'Internal Server Error in proxy.' });
  }
}