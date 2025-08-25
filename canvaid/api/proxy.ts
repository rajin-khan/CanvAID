// canvaid/api/proxy.ts
// This file MUST be in the root `canvaid/api/` directory.
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  // The complete path and query string from the original request
  // is correctly extracted from the `path` query parameter.
  const canvasPathAndQuery = req.query.path;

  const canvasHost = req.headers['x-canvas-host'];
  const authorization = req.headers['authorization'];

  if (!canvasHost) {
    return res.status(400).json({ error: "Proxy error: Missing X-Canvas-Host header." });
  }

  if (!authorization) {
    return res.status(401).json({ error: "Proxy error: Missing Authorization header." });
  }
  
  // THE FIX: The hardcoded '/api/v1/' has been removed.
  // The 'canvasPathAndQuery' variable already contains the full path (e.g., 'api/v1/courses').
  // This now constructs the correct URL like: https://[your-host]/api/v1/courses
  const targetUrl = `${canvasHost}/${canvasPathAndQuery}`;

  try {
    // Make the actual request from the serverless function to the Canvas API.
    const canvasResponse = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Authorization': authorization,
        // Let fetch handle the Content-Type for body requests.
      },
      // Pass along the body if it exists (for POST/PUT requests).
      body: req.body ? JSON.stringify(req.body) : undefined,
    });

    // To properly handle all response types (JSON, text, etc.),
    // we forward the raw response from Canvas back to the client.
    res.status(canvasResponse.status);

    // Copy headers from Canvas response to our response
    canvasResponse.headers.forEach((value, key) => {
      // Vercel handles these headers automatically.
      if (key.toLowerCase() !== 'content-encoding' && key.toLowerCase() !== 'transfer-encoding') {
        res.setHeader(key, value);
      }
    });
    
    const responseBody = await canvasResponse.arrayBuffer();
    res.send(Buffer.from(responseBody));

  } catch (error) {
    console.error('Error in Vercel proxy function:', error);
    res.status(500).json({ error: 'Internal Server Error in proxy function.' });
  }
}