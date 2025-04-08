#!/bin/sh
# Script to start the Jay's Frames Notification System Demo server

# Find Python executable
PYTHON=$(which python3 || which python)

if [ -z "$PYTHON" ]; then
  echo "Error: Python not found. Please install Python 3."
  exit 1
fi

# Run the Python server script
exec $PYTHON serve.py