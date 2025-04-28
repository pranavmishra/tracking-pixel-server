const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Memory to store all opens
const opens = [];

// 1x1 transparent pixel
const pixel = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAJ+XWfQAAAAASUVORK5CYII=',
  'base64'
);

// Tracking route
app.get('/track', (req, res) => {
  const now = new Date();
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const userAgent = req.get('User-Agent');
  const email = req.query.email || 'unknown';

  const logEntry = {
    time: now.toISOString(),
    email: email,
    ip: ip,
    userAgent: userAgent
  };

  opens.push(logEntry);
  console.log(logEntry);

  res.writeHead(200, {
    'Content-Type': 'image/png',
    'Content-Length': pixel.length,
  });
  res.end(pixel);
});

// Dashboard route
app.get('/', (req, res) => {
  let html = `
    <h1>📈 Email Open Tracking Dashboard</h1>
    <table border="1" cellpadding="5" cellspacing="0">
      <tr>
        <th>Email</th>
        <th>Time</th>
        <th>IP Address</th>
        <th>User Agent</th>
      </tr>`;

  opens.forEach(entry => {
    html += `
      <tr>
        <td>${entry.email}</td>
        <td>${entry.time}</td>
        <td>${entry.ip}</td>
        <td>${entry.userAgent}</td>
      </tr>`;
  });

  html += `</table>`;

  res.send(html);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
