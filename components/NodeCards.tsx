'use client'

import { TrafficNode } from '@/types/traffic'
import { Activity, TrendingDown, TrendingUp, AlertCircle } from 'lucide-react'

interface NodeCardsProps {
  nodes: TrafficNode[]
}

function getStressColor(stress: number): string {
  if (stress >= 81) return 'border-red-500 bg-red-500/10'
  if (stress >= 61) return 'border-orange-500 bg-orange-500/10'
  if (stress >= 31) return 'border-yellow-500 bg-yellow-500/10'
  return 'border-green-500 bg-green-500/10'
}

function getStressTextColor(stress: number): string {
  if (stress >= 81) return 'text-red-400'
  if (stress >= 61) return 'text-orange-400'
  if (stress >= 31) return 'text-yellow-400'
  return 'text-green-400'
}

export default function NodeCards({ nodes }: NodeCardsProps) {
  return (
    <div className="space-y-3 max-h-[700px] overflow-y-auto pr-2" data-testid="node-cards-container">
      {nodes.map((node) => {
        const speedChange = ((node.current_speed - node.normal_speed) / node.normal_speed) * 100
        const isSlower = speedChange < 0

        return (
          <div
            key={node.id}
            className={`bg-slate-900 rounded-lg border-2 p-4 transition-all hover:scale-[1.02] ${
              getStressColor(node.stress_score)
            } animate-slide-up`}
            data-testid={`node-card-${node.id}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-white text-sm mb-1">{node.name}</h3>
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-slate-400" />
                  <span className={`text-2xl font-bold ${getStressTextColor(node.stress_score)}`}>
                    {node.stress_score}
                  </span>
                </div>
              </div>
              <div className={`text-xs px-2 py-1 rounded font-semibold uppercase ${
                node.stress_score >= 81 ? 'bg-red-500 text-white' :
                node.stress_score >= 61 ? 'bg-orange-500 text-white' :
                node.stress_score >= 31 ? 'bg-yellow-500 text-slate-900' :
                'bg-green-500 text-white'
              }`}>
                {node.stress_score >= 81 ? 'CRITICAL' :
                 node.stress_score >= 61 ? 'HIGH' :
                 node.stress_score >= 31 ? 'ELEVATED' : 'NORMAL'}
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Speed</span>
                <div className="flex items-center space-x-2">
                  {isSlower ? (
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  ) : (
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  )}
                  <span className="text-white font-semibold">{node.current_speed} km/h</span>
                  <span className="text-slate-500 text-xs">({node.normal_speed} avg)</span>
                </div>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">Density</span>
                <span className={`font-semibold uppercase ${
                  node.density === 'high' ? 'text-red-400' :
                  node.density === 'medium' ? 'text-yellow-400' : 'text-green-400'
                }`}>
                  {node.density}
                </span>
              </div>

              {node.incidents.length > 0 && (
                <div className="mt-2 pt-2 border-t border-slate-700">
                  <div className="flex items-center space-x-1 mb-1">
                    <AlertCircle className="w-3 h-3 text-red-400" />
                    <span className="text-xs text-red-400 font-semibold">Active Incidents</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {node.incidents.map((incident, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-red-500/20 text-red-300 px-2 py-0.5 rounded"
                      >
                        {incident.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
