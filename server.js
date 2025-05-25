const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS', 'HEAD'],
  allowedHeaders: ['Content-Type', 'X-Requested-With'],
  credentials: true,
}));

app.get('/api/*', async (req, res) => {
  try {
    const path = req.params[0];
    const query = req.originalUrl.split('?')[1] || '';
    const targetUrl = `http://143.44.136.110:6910/${path}?${query}`;

    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
      redirect: 'follow',
    });

    res.set({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, HEAD',
      'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With',
      'Access-Control-Allow-Credentials': 'true',
      'Content-Type': response.headers.get('content-type') || 'application/octet-stream'
    });

    const body = await response.arrayBuffer();
    res.status(response.status).send(Buffer.from(body));
  } catch (error) {
    console.error(error);
    res.status(500).send('Proxy error');
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
