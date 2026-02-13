const { createServer } = require('http')
const { Server } = require('socket.io')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const hostname = '0.0.0.0'
const port = 3000

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

// Mock data generator inline
function generateMockTrafficData() {
  const ORR_NODES = [
    { id: 'silk_board', name: 'Silk Board Junction', lat: 12.9177, lng: 77.6238 },
    { id: 'marathahalli', name: 'Marathahalli Bridge', lat: 12.9591, lng: 77.7010 },
    { id: 'brookefield', name: 'Brookefield', lat: 12.9716, lng: 77.7134 },
    { id: 'bellandur', name: 'Bellandur Junction', lat: 12.9260, lng: 77.6785 },
    { id: 'ecospace', name: 'Ecospace', lat: 12.9344, lng: 77.6906 },
    { id: 'whitefield', name: 'Whitefield', lat: 12.9698, lng: 77.7500 },
    { id: 'sarjapur', name: 'Sarjapur Road', lat: 12.9010, lng: 77.6860 },
    { id: 'kr_puram', name: 'KR Puram', lat: 13.0111, lng: 77.6969 },
  ]

  const hour = new Date().getHours()
  const isPeak = (hour >= 8 && hour <= 11) || (hour >= 17 && hour <= 20)
  
  const rand = Math.random()
  const weather = {
    condition: rand < 0.7 ? 'clear' : rand < 0.9 ? 'light_rain' : 'heavy_rain',
    intensity: rand < 0.7 ? 0 : rand < 0.9 ? 4 : 8
  }

  const nodes = ORR_NODES.map((node) => {
    let stress = isPeak ? Math.random() * 30 + 20 : Math.random() * 20 + 5
    
    if (isPeak && ['bellandur', 'ecospace', 'whitefield'].includes(node.id)) {
      stress += 20
    }
    if (node.id === 'silk_board') stress += 15
    if (weather.condition === 'light_rain') stress += 15
    if (weather.condition === 'heavy_rain') stress += 30
    
    stress = Math.min(Math.max(stress, 0), 100)
    
    const normalSpeed = 35 + Math.random() * 10
    const speedReduction = (stress / 100) * 0.8
    const currentSpeed = normalSpeed * (1 - speedReduction)
    
    const incidents = []
    if (weather.condition === 'heavy_rain') incidents.push('heavy_rain')
    if (weather.condition === 'light_rain') incidents.push('light_rain')
    if (stress > 80 && Math.random() > 0.7) incidents.push('congestion')
    
    let density = 'low'
    if (stress > 60) density = 'high'
    else if (stress > 30) density = 'medium'
    
    return {
      id: node.id,
      name: node.name,
      lat: node.lat,
      lng: node.lng,
      current_speed: Math.round(currentSpeed),
      normal_speed: Math.round(normalSpeed),
      stress_score: Math.round(stress),
      density,
      incidents,
      history: Array(24).fill(0).map((_, i) => Math.round(stress + (Math.random() - 0.5) * 20)),
    }
  })

  // Generate alerts
  const cascade_alerts = []
  for (let i = 0; i < nodes.length - 1; i++) {
    const node = nodes[i]
    const nextNode = nodes[i + 1]
    let riskScore = 0
    const triggers = []
    
    if (node.stress_score > 50) {
      riskScore += 30
      triggers.push('High congestion')
    }
    
    if (weather.condition === 'heavy_rain' && node.stress_score > 40) {
      riskScore *= 1.5
      triggers.push('Heavy rain amplification')
    }
    
    if (isPeak && node.stress_score > 55) {
      riskScore += 10
      triggers.push('Peak hour surge')
    }
    
    riskScore = Math.min(riskScore, 100)
    
    if (riskScore > 70) {
      let riskLevel = 'medium'
      if (riskScore > 85) riskLevel = 'critical'
      else if (riskScore > 75) riskLevel = 'high'
      
      const timeToCollapse = riskScore > 85 ? '10-15 minutes' : riskScore > 75 ? '15-20 minutes' : '20-30 minutes'
      const confidence = Math.round(65 + Math.random() * 25)
      
      cascade_alerts.push({
        id: `alert_${node.id}_${Date.now()}`,
        risk_level: riskLevel,
        score: Math.round(riskScore),
        segment: `${node.name} → ${nextNode.name}`,
        time_to_collapse: timeToCollapse,
        trigger: triggers.join(' + '),
        confidence,
        timestamp: new Date().toISOString(),
        acknowledged: false,
      })
    }
  }

  return {
    timestamp: new Date().toISOString(),
    nodes,
    weather,
    cascade_alerts,
    isPeak,
  }
}

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true)
    handle(req, res, parsedUrl)
  })

  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  })

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id)

    // Send initial data
    const initialData = generateMockTrafficData()
    socket.emit('traffic-update', initialData)

    // Send updates every 30 seconds
    const interval = setInterval(() => {
      const data = generateMockTrafficData()
      socket.emit('traffic-update', data)
    }, 30000)

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id)
      clearInterval(interval)
    })
  })

  server.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`)
    console.log(`> WebSocket server running`)
  })
})
