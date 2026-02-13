import { Intervention } from '@/types/traffic'

export function generateInterventions(alertScore: number, segment: string): Intervention[] {
  const interventions: Intervention[] = []
  
  // Signal Timing Adjustment
  const signalImpact = Math.round(10 + Math.random() * 10)
  interventions.push({
    id: `int_signal_${Date.now()}`,
    type: 'signal',
    title: 'Signal Timing Adjustment',
    description: `Extend green time at ${segment.split('→')[0].trim()} junction by 30-45 seconds`,
    impact: signalImpact,
    feasibility: 'immediate',
    effort: 'low',
    sideEffects: 'minimal',
    effectivenessScore: 0,
    status: 'pending',
  })
  
  // Route Diversion
  const diversionImpact = Math.round(15 + Math.random() * 15)
  interventions.push({
    id: `int_diversion_${Date.now()}`,
    type: 'diversion',
    title: 'Route Diversion',
    description: `Divert traffic via service road and alternate routes around ${segment.split('→')[0].trim()}`,
    impact: diversionImpact,
    feasibility: '15min',
    effort: 'medium',
    sideEffects: 'moderate',
    effectivenessScore: 0,
    status: 'pending',
  })
  
  // Public Alert
  const alertImpact = Math.round(8 + Math.random() * 8)
  interventions.push({
    id: `int_alert_${Date.now()}`,
    type: 'alert',
    title: 'Public Alert Broadcast',
    description: `Send real-time alerts to cab aggregators and navigation apps to avoid ${segment}`,
    impact: alertImpact,
    feasibility: 'immediate',
    effort: 'low',
    sideEffects: 'minimal',
    effectivenessScore: 0,
    status: 'pending',
  })
  
  // High impact scenarios
  if (alertScore > 80) {
    // Demand Management
    const demandImpact = Math.round(20 + Math.random() * 10)
    interventions.push({
      id: `int_demand_${Date.now()}`,
      type: 'demand',
      title: 'Demand Management',
      description: `Recommend WFH for IT parks in affected corridor and stagger office timings`,
      impact: demandImpact,
      feasibility: '1hour',
      effort: 'high',
      sideEffects: 'high',
      effectivenessScore: 0,
      status: 'pending',
    })
    
    // Incident Response
    const incidentImpact = Math.round(12 + Math.random() * 10)
    interventions.push({
      id: `int_incident_${Date.now()}`,
      type: 'incident',
      title: 'Emergency Response Deployment',
      description: `Deploy traffic police and response teams to ${segment.split('→')[0].trim()}`,
      impact: incidentImpact,
      feasibility: '15min',
      effort: 'medium',
      sideEffects: 'minimal',
      effectivenessScore: 0,
      status: 'pending',
    })
  }
  
  // Calculate effectiveness scores and sort
  interventions.forEach(int => {
    const effectiveness = int.impact / 30
    const feasibilityScore = int.feasibility === 'immediate' ? 1 : int.feasibility === '15min' ? 0.7 : 0.4
    const sideEffectsScore = int.sideEffects === 'minimal' ? 1 : int.sideEffects === 'moderate' ? 0.6 : 0.3
    
    int.effectivenessScore = (effectiveness * 0.5) + (feasibilityScore * 0.3) + (sideEffectsScore * 0.2)
  })
  
  return interventions.sort((a, b) => b.effectivenessScore - a.effectivenessScore)
}
