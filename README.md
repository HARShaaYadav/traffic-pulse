# 🚦 TrafficPulse

Real-time AI-powered traffic cascade prevention system for Bangalore's Outer Ring Road (Silk Board → KR Puram).

## Features

- **Predictive Cascade Detection** — Graph-theoretic AI models identify systemic stress before it escalates
- **Real-time Traffic Monitoring** — Live heatmap, stress scores, and speed tracking across 8 ORR junctions
- **Multi-channel Alerts** — SMS (Twilio), Email (SMTP), Twitter, and push notifications
- **AI-powered Interventions** — Google Gemini generates natural language recommendations
- **Emergency Dispatch** — Optimized routing via OpenRoute Service for emergency vehicles
- **Weather Integration** — Real-time weather impact analysis on traffic flow
- **Role-based Access** — Admin and viewer roles with restricted views
- **Corporate Dashboard** — WFH recommendations and shift timing suggestions

## Tech Stack

- **Frontend**: Next.js 16, React 19, TailwindCSS, Chart.js, Leaflet Maps
- **Backend**: Next.js API Routes, Socket.IO
- **Database**: MongoDB Atlas
- **AI**: Google Gemini API
- **APIs**: Google Maps, Mapbox, OpenRoute Service, WeatherAPI, Twilio, Twitter

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### Setup

```bash
# Install dependencies
npm install

# Copy environment variables
cp example.env .env.local
# Edit .env.local with your API keys

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Demo Credentials

- **Email**: admin@traffic.com
- **Password**: admin123

## Environment Variables

See `example.env` for all required configuration. Key services:

| Service     | Required | Purpose               |
| ----------- | -------- | --------------------- |
| MongoDB     | ✅       | Database              |
| Google Maps | ✅       | Map visualization     |
| Gemini AI   | ✅       | AI recommendations    |
| Mapbox      | Optional | Alternative map tiles |
| OpenRoute   | Optional | Emergency routing     |
| WeatherAPI  | Optional | Weather integration   |
| Twilio      | Optional | SMS alerts            |
| SMTP        | Optional | Email alerts          |
| Twitter     | Optional | Social media alerts   |
