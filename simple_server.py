#!/usr/bin/env python3
"""
Simple HTTP Server for Jay's Frames Notification System Demo

This script starts a simple HTTP server to serve the static files
without requiring Node.js or npm to be installed.
"""
import http.server
import socketserver
import os
import sys
import time
import socket
from datetime import datetime

# Configuration
PORT = 8080
DIRECTORY = "."  # Serve from the current directory

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    """Custom handler for the HTTP server."""
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
    
    def end_headers(self):
        """Add CORS headers to allow cross-origin requests."""
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        super().end_headers()
    
    def log_message(self, format, *args):
        """Log messages with timestamps."""
        timestamp = datetime.now().strftime("[%Y-%m-%d %H:%M:%S]")
        sys.stderr.write(f"{timestamp} {self.address_string()} - {format % args}\n")

def main():
    """Start the HTTP server."""
    try:
        # Create the HTTP server
        handler = CustomHandler
        with socketserver.TCPServer(("0.0.0.0", PORT), handler) as httpd:
            print(f"Server started at http://localhost:{PORT}")
            print(f"Try opening this URL in your browser: http://localhost:{PORT}/")
            print(f"Press Ctrl+C to stop the server.")
            
            # Check if we can connect to the server
            try:
                with socket.create_connection(("localhost", PORT), timeout=1) as conn:
                    print(f"Server is accessible at localhost:{PORT}")
            except (socket.timeout, ConnectionRefusedError):
                print(f"Warning: Could not connect to localhost:{PORT}. This might be normal if the server is still starting.")
            
            # Start the server
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
    except PermissionError:
        print(f"Error: Permission denied for port {PORT}. Try a different port.")
    except OSError as e:
        if e.errno == 98:  # Address already in use
            print(f"Error: Port {PORT} is already in use. Try a different port.")
        else:
            print(f"Error: {e}")

if __name__ == "__main__":
    main()