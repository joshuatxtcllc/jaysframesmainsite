// Simple Express server for Jay's Frames Notification System
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));

// Define routes for the demo pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/standalone', (req, res) => {
  res.sendFile(path.join(__dirname, 'notification-standalone.html'));
});

app.get('/embed', (req, res) => {
  res.sendFile(path.join(__dirname, 'jf-notification-demo.html'));
});

app.get('/simple', (req, res) => {
  res.sendFile(path.join(__dirname, 'demo.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
  console.log('Available demo pages:');
  console.log(`- Main page: http://localhost:${port}/`);
  console.log(`- Standalone demo: http://localhost:${port}/standalone`);
  console.log(`- Embed demo: http://localhost:${port}/embed`);
  console.log(`- Simple demo: http://localhost:${port}/simple`);
});