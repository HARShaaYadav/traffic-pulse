export interface TrafficNode {
  id: string
  name: string
  lat: number
  lng: number
  current_speed: number
  normal_speed: number
  stress_score: number
  stress: number // Alias for stress_score for backward compatibility
  speed: number // Alias for current_speed for backward compatibility
  density: 'low' | 'medium' | 'high'
  incidents: string[]
  history: number[]
}

export interface WeatherData {
  condition: 'clear' | 'light_rain' | 'heavy_rain'
  intensity: number
}

export interface CascadeAlert {
  id: string
  risk_level: 'low' | 'medium' | 'high' | 'critical'
  severity: 'low' | 'medium' | 'high' | 'critical' // Alias for risk_level
  score: number
  segment: string
  time_to_collapse: string
  trigger: string
  message: string // Alert message
  confidence: number
  timestamp: string
  acknowledged: boolean
}

export interface Intervention {
  id: string
  type: 'signal' | 'diversion' | 'alert' | 'demand' | 'incident'
  title: string
  description: string
  impact: number
  feasibility: 'immediate' | '15min' | '1hour'
  effort: 'low' | 'medium' | 'high'
  sideEffects: 'minimal' | 'moderate' | 'high'
  effectivenessScore: number
  status: 'pending' | 'accepted' | 'rejected'
}

export interface TrafficData {
  timestamp: string
  nodes: TrafficNode[]
  weather: WeatherData
  cascade_alerts: CascadeAlert[]
  isPeak: boolean
}

export interface SimulationParams {
  trigger: string
  location: string
  intervention: string
  timeHorizon: string
}

export interface SimulationResult {
  without: {
    nodes: { name: string; stress: number }[]
    totalDelay: number
    affectedNodes: number
    avgDelay: string
    cascadeProbability: number
  }
  with: {
    nodes: { name: string; stress: number }[]
    totalDelay: number
    affectedNodes: number
    avgDelay: string
    cascadeProbability: number
  }
  recommendation: string
  trigger: string
  location: string
  intervention: string
  timeHorizon: string
  timestamp: Date
}
