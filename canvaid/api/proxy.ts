// canvaid/api/proxy.ts
// Make sure you are using Vercel's types. If you don't have them, run:
// npm install --save-dev @vercel/node
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  // Extract the target Canvas API path from the incoming request URL.
  // req.url will be something like '/api/v1/courses?enrollment_state=active'
  const canvasApiPath = req.url;

  // Read the custom 'X-Canvas-Host' header sent by our apiClient.
  const canvasHost = req.headers['x-canvas-host'];

  // Read the Authorization header.
  const authorization = req.headers['authorization'];

  if (!canvasHost) {
    return res.status(400).json({ error: "Missing X-Canvas-Host header." });
  }

  if (!authorization) {
    return res.status(401).json({ error: "Missing Authorization header." });
  }

  try {
    const targetUrl = `${canvasHost}${canvasApiPath}`;
    
    // Make the actual request from the serverless function to the Canvas API.
    // This is a server-to-server request, so there are no CORS issues.
    const canvasResponse = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Authorization': authorization,
        'Content-Type': req.headers['content-type'] || 'application/json',
      },
      // Pass along the body if it exists (for POST/PUT requests)
      body: req.body ? JSON.stringify(req.body) : null,
    });

    // Check if the response from Canvas was successful
    if (!canvasResponse.ok) {
        const errorData = await canvasResponse.text();
        // Send back the same status and error message from Canvas
        return res.status(canvasResponse.status).send(errorData);
    }

    // Send the successful response from Canvas back to the frontend
    const data = await canvasResponse.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error('Error in proxy function:', error);
    return res.status(500).json({ error: 'Internal Server Error in proxy.' });
  }
}