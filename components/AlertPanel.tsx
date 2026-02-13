'use client'

import { CascadeAlert } from '@/types/traffic'
import { AlertTriangle, Clock, TrendingUp, XCircle } from 'lucide-react'

interface AlertPanelProps {
  alerts: CascadeAlert[]
}

export default function AlertPanel({ alerts }: AlertPanelProps) {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'border-red-500 bg-red-500/10 glow-red'
      case 'high': return 'border-orange-500 bg-orange-500/10 glow-orange'
      case 'medium': return 'border-yellow-500 bg-yellow-500/10'
      default: return 'border-green-500 bg-green-500/10'
    }
  }

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-500 text-white'
      case 'high': return 'bg-orange-500 text-white'
      case 'medium': return 'bg-yellow-500 text-slate-900'
      default: return 'bg-green-500 text-white'
    }
  }

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-xl" data-testid="alert-panel">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="w-6 h-6 text-red-400" />
          <h2 className="text-xl font-bold text-white font-space-grotesk">Cascade Risk Alerts</h2>
        </div>
        <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm font-semibold">
          {alerts.length} Active {alerts.length === 1 ? 'Alert' : 'Alerts'}
        </span>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`border-2 rounded-lg p-4 transition-all animate-pulse-ring ${
              getRiskColor(alert.risk_level)
            }`}
            data-testid={`alert-${alert.id}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    getRiskBadge(alert.risk_level)
                  }`}>
                    {alert.risk_level} RISK
                  </span>
                  <span className="text-white font-bold text-lg">Score: {alert.score}</span>
                  <span className="text-slate-400 text-sm">({alert.confidence}% confidence)</span>
                </div>
                <h3 className="text-white font-semibold text-lg mb-1">{alert.segment}</h3>
                <p className="text-slate-300 text-sm">{alert.trigger}</p>
              </div>
              <button className="text-slate-400 hover:text-white transition" data-testid="alert-dismiss-btn">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span className="text-slate-300">Time to cascade:</span>
                <span className="text-red-400 font-bold">{alert.time_to_collapse}</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-orange-400" />
                <span className="text-slate-300">Detected:</span>
                <span className="text-slate-400">{new Date(alert.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
