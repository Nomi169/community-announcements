#!/bin/bash

echo ""
echo "================================================"
echo "   Community Announcements Platform - Startup"
echo "================================================"
echo ""

# Kill any existing processes on our ports
lsof -ti:3001 | xargs kill -9 2>/dev/null
lsof -ti:5173 | xargs kill -9 2>/dev/null

echo "▶ Starting backend server on http://localhost:3001 ..."
cd "$(dirname "$0")/backend" && node server.js &
BACKEND_PID=$!

sleep 1

echo "▶ Starting frontend dev server on http://localhost:5173 ..."
cd "$(dirname "$0")/frontend" && npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅  Platform is running!"
echo ""
echo "   Public View  →  http://localhost:5173"
echo "   Admin Panel  →  http://localhost:5173/admin"
echo "   Admin Login  →  http://localhost:5173/admin/login"
echo ""
echo "   Credentials:  admin / admin123"
echo ""
echo "   API Backend  →  http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop all servers."
echo ""

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo 'Servers stopped.'; exit 0" SIGINT SIGTERM
wait
