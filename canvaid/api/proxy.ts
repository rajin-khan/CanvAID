// canvaid/api/proxy.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  // --- MODIFIED: Read from server-side environment variable ---
  const canvasHost = process.env.CANVAS_BASE_URL;
  // --- END MODIFICATION ---

  const canvasPathAndQuery = req.query.path;
  const authorization = req.headers['authorization'];

  if (!canvasHost) {
    return res.status(500).json({ error: "Proxy error: CANVAS_BASE_URL is not configured on the server." });
  }

  if (!authorization) {
    return res.status(401).json({ error: "Proxy error: Missing Authorization header." });
  }
  
  const targetUrl = `${canvasHost}/${canvasPathAndQuery}`;

  try {
    const canvasResponse = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Authorization': authorization,
      },
      body: req.body ? JSON.stringify(req.body) : undefined,
    });

    res.status(canvasResponse.status);

    canvasResponse.headers.forEach((value, key) => {
      if (key.toLowerCase() !== 'content-encoding' && key.toLowerCase() !== 'transfer-encoding') {
        res.setHeader(key, value);
      }
    });
    
    const responseBody = await canvasResponse.arrayBuffer();
    res.send(Buffer.from(responseBody));

  } catch (error) {
    console.error('Error in Vercel proxy function:', error, { targetUrl });
    res.status(500).json({ error: 'Internal Server Error in proxy function.' });
  }
}