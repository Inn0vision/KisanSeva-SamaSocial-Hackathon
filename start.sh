#!/bin/bash

# Ensure all child processes are killed when this script exits or gets a Ctrl+C
trap 'kill $(jobs -p) 2>/dev/null; exit' INT TERM EXIT

echo "Starting AgroSetu Backend..."
cd backend || exit 1
if [ ! -d "venv" ]; then
    echo "❌ Error: Backend virtual environment not found!"
    echo "Please run ./init_project.sh first to install dependencies."
    exit 1
fi
source venv/bin/activate
uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!

echo "Starting AgroSetu Frontend..."
cd ../frontend || exit 1
npm run dev &
FRONTEND_PID=$!

echo "====================================="
echo "🚀 Both services are running!"
echo "Frontend: http://localhost:5173"
echo "Backend API: http://localhost:8000/docs"
echo "Press Ctrl+C to stop both services."
echo "====================================="

# Wait indefinitely until interrupted
wait
