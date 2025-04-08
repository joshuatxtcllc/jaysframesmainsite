#!/usr/bin/env python3
"""
Simple HTTP Server for Jay's Frames Notification System Demo

This script starts a simple HTTP server to serve the static files
for the Jay's Frames Notification System Demo.
"""

import http.server
import socketserver
import os
import sys
import time
from pathlib import Path

# Set the port for the server
PORT = 8000

# Get the current directory
CURRENT_DIR = Path(__file__).parent.absolute()

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    """Custom handler for our HTTP server."""
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(CURRENT_DIR), **kwargs)
    
    def end_headers(self):
        """Add CORS headers to allow cross-origin requests."""
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()
    
    def log_message(self, format, *args):
        """Log messages with timestamps."""
        sys.stderr.write(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] {self.address_string()} - {format % args}\n")

def main():
    """Start the HTTP server."""
    # Create the server
    with socketserver.TCPServer(("0.0.0.0", PORT), CustomHandler) as httpd:
        print(f"Serving Jay's Frames Notification System Demo at http://0.0.0.0:{PORT}")
        print("Available demo pages:")
        print(f"  - Main Demo: http://localhost:{PORT}/notification-standalone.html")
        print(f"  - Embed Demo: http://localhost:{PORT}/jf-notification-demo.html")
        print("Press Ctrl+C to stop the server")
        
        try:
            # Serve until keyboard interrupt
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down the server...")
            httpd.server_close()
            print("Server shut down.")

if __name__ == "__main__":
    main()