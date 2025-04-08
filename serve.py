#!/usr/bin/env python3
"""
Simple HTTP Server for Jay's Frames

This script starts a simple HTTP server to serve the static files
for the Jay's Frames website.
"""

import http.server
import socketserver
import os
import time
from datetime import datetime

PORT = 8080

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    """Custom handler for our HTTP server."""
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
    
    def end_headers(self):
        """Add CORS headers to allow cross-origin requests."""
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()
    
    def log_message(self, format, *args):
        """Log messages with timestamps."""
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        print(f"[{timestamp}] {self.address_string()} - {format % args}")

def main():
    """Start the HTTP server."""
    handler = CustomHandler
    
    with socketserver.TCPServer(("0.0.0.0", PORT), handler) as httpd:
        print(f"Server started at http://0.0.0.0:{PORT}")
        print("Press Ctrl+C to stop the server")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("Server stopped")

if __name__ == "__main__":
    main()