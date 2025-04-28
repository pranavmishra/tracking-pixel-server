const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// 1x1 transparent pixel in base64
const pixel = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAJ+XWfQAAAAASUVORK5CYII=',
  'base64'
);

// Main tracking route
app.get('/track', (req, res) => {
  const now = new Date();
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const userAgent = req.get('User-Agent');
  const email = req.query.email || 'unknown';

  const logEntry = `${now.toISOString()} - Email: ${email} - IP: ${ip} - User-Agent: ${userAgent}\n`;

  console.log(logEntry);

  res.writeHead(200, {
    'Content-Type': 'image/png',
    'Content-Length': pixel.length,
  });
  res.end(pixel);
});

// Health check route
app.get('/', (req, res) => {
  res.send('✅ Tracking Pixel Server is Live!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
