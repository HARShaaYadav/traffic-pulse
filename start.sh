#!/bin/bash

echo "🚦 Starting TrafficPulse..."
echo "📍 Bangalore ORR Corridor (Silk Board - KR Puram)"
echo ""

cd /app/traffic-pulse

echo "🔧 Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    yarn install
fi

echo ""
echo "🚀 Starting Next.js server with WebSocket..."
echo "🌐 Application will be available at: http://localhost:3001"
echo "⚡ Real-time updates every 30 seconds"
echo ""
echo "Press Ctrl+C to stop the server"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

yarn dev
