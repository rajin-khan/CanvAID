// canvaid/api/proxy.ts

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  // 1. Read the base URL from the server-side environment variable.
  const canvasHost = process.env.CANVAS_BASE_URL;

  if (!canvasHost) {
    console.error("CRITICAL: CANVAS_BASE_URL environment variable is not set.");
    return res.status(500).json({ 
      error: "Server configuration error: The Canvas API URL is missing on the server." 
    });
  }

  // 2. Safely handle the path.
  const pathQuery = req.query.path;
  const canvasPathAndQuery = Array.isArray(pathQuery) ? pathQuery.join('/') : pathQuery;

  if (!canvasPathAndQuery) {
    return res.status(400).json({ error: "Proxy error: Missing 'path' in the request." });
  }

  const authorization = req.headers['authorization'];

  if (!authorization) {
    return res.status(401).json({ error: "Proxy error: Missing Authorization header." });
  }
  
  const targetUrl = `${canvasHost}/${canvasPathAndQuery}`;
  
  // START OF THE FIX: Create fetch options object
  const fetchOptions: RequestInit = {
    method: req.method,
    headers: {
      'Authorization': authorization,
    },
  };
  
  // Conditionally add the body ONLY for non-GET requests
  if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
    fetchOptions.body = req.body;
  }
  // END OF THE FIX

  try {
    // Pass the correctly configured options to fetch
    const canvasResponse = await fetch(targetUrl, fetchOptions);

    // Forward the status from Canvas
    res.status(canvasResponse.status);

    // Forward the headers from Canvas
    canvasResponse.headers.forEach((value, key) => {
      if (key.toLowerCase() !== 'content-encoding' && key.toLowerCase() !== 'transfer-encoding') {
        res.setHeader(key, value);
      }
    });
    
    // Forward the body as a buffer
    const responseBody = await canvasResponse.arrayBuffer();
    res.send(Buffer.from(responseBody));

  } catch (error) {
    console.error('Error in Vercel proxy function:', error, { targetUrl });
    res.status(500).json({ error: 'Internal Server Error during proxy request.' });
  }
}