/**
 * Simple HTTP Server for Jay's Frames Notification System Demo
 * 
 * This script starts a simple HTTP server to serve the static files
 * for the Jay's Frames Notification System Demo.
 */

// Use the built-in http module
const http = require('http');
const fs = require('fs');
const path = require('path');

// Set the port for the server
const PORT = 8000;

// MIME types for different file extensions
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain'
};

// Create the HTTP server
const server = http.createServer((req, res) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  
  // Handle root path
  let url = req.url;
  if (url === '/') {
    url = '/index.html';
  }
  
  // Get the file path
  const filePath = path.join(__dirname, url);
  
  // Get the file extension
  const extname = path.extname(filePath);
  
  // Set default content type
  let contentType = MIME_TYPES[extname] || 'application/octet-stream';
  
  // Read the file
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // File not found
        fs.readFile(path.join(__dirname, '/index.html'), (err, content) => {
          if (err) {
            // If even the index.html is missing, send 404
            res.writeHead(404);
            res.end('404 - File Not Found');
            return;
          }
          
          // Return index.html instead
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(content, 'utf-8');
        });
      } else {
        // Server error
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      // Success - set headers and send content
      res.writeHead(200, { 
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Cache-Control': 'no-store, no-cache, must-revalidate'
      });
      res.end(content, 'utf-8');
    }
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Serving Jay's Frames Notification System Demo at http://localhost:${PORT}`);
  console.log("Available demo pages:");
  console.log(`  - Main Demo: http://localhost:${PORT}/index.html`);
  console.log(`  - Embed Demo: http://localhost:${PORT}/jf-notification-demo.html`);
  console.log("Press Ctrl+C to stop the server");
});

// Handle server errors
server.on('error', (err) => {
  console.error(`Server error: ${err.message}`);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log("\nShutting down the server...");
  server.close(() => {
    console.log("Server shut down.");
    process.exit(0);
  });
});