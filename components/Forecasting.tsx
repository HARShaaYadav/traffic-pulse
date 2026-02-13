'use client'

import { useState, useEffect } from 'react'
import { Clock, TrendingUp, AlertCircle, PlayCircle, CheckCircle } from 'lucide-react'

interface ForecastData {
  forecast: Array<{
    id: string
    name: string
    predictedStress: number
    confidence: number
    confidenceRange: [number, number]
    triggers: string[]
  }>
  warnings: Array<{
    nodeId: string
    nodeName: string
    predictedStress: number
    timeToImpact: number
    recommendedAction: string
  }>
  forecastTime: string
  avgPredictedStress: number
}

export default function Forecasting() {
  const [timeOffset, setTimeOffset] = useState(30) // minutes
  const [forecastData, setForecastData] = useState<ForecastData | null>(null)
  const [loading, setLoading] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)

  useEffect(() => {
    fetchForecast()
    if (autoRefresh) {
      const interval = setInterval(() => fetchForecast(), 60000) // every minute
      return () => clearInterval(interval)
    }
  }, [timeOffset, autoRefresh])

  const fetchForecast = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timeOffset }),
      })
      const data = await res.json()
      setForecastData(data)
    } catch (error) {
      console.error('Forecast failed:', error)
    }
    setLoading(false)
  }

  const getStressColor = (stress: number) => {
    if (stress >= 81) return 'text-red-400 bg-red-500/20'
    if (stress >= 61) return 'text-orange-400 bg-orange-500/20'
    if (stress >= 31) return 'text-yellow-400 bg-yellow-500/20'
    return 'text-green-400 bg-green-500/20'
  }

  const formatTime = (offset: number) => {
    const future = new Date(Date.now() + offset * 60000)
    return future.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white font-space-grotesk mb-2">
          Predictive Forecasting System
        </h1>
        <p className="text-slate-400">AI-powered traffic predictions 30-120 minutes in advance</p>
      </div>

      {/* Timeline Slider */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Prediction Timeline</h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                autoRefresh
                  ? 'bg-green-500 text-white'
                  : 'bg-slate-700 text-slate-300'
              }`}
            >
              {autoRefresh ? 'Auto-Refresh ON' : 'Auto-Refresh OFF'}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <span className="text-slate-400 text-sm w-24">Now</span>
            <input
              type="range"
              min="15"
              max="120"
              step="15"
              value={timeOffset}
              onChange={(e) => setTimeOffset(parseInt(e.target.value))}
              className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-slate-400 text-sm w-24 text-right">+2 hours</span>
          </div>

          <div className="flex items-center justify-center space-x-3 text-lg">
            <Clock className="w-6 h-6 text-cyan-400" />
            <span className="text-white font-bold">Predicted Traffic at {formatTime(timeOffset)}</span>
            <span className="text-slate-400">(in {timeOffset} minutes)</span>
          </div>

          <div className="flex justify-between text-sm text-slate-500 px-2">
            {[15, 30, 45, 60, 75, 90, 105, 120].map((min) => (
              <button
                key={min}
                onClick={() => setTimeOffset(min)}
                className={`hover:text-cyan-400 transition ${
                  timeOffset === min ? 'text-cyan-400 font-bold' : ''
                }`}
              >
                +{min}m
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Warnings */}
      {forecastData && forecastData.warnings.length > 0 && (
        <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-xl border-2 border-red-500/50 p-6 animate-pulse-ring">
          <div className="flex items-center space-x-3 mb-4">
            <AlertCircle className="w-8 h-8 text-red-400" />
            <h2 className="text-2xl font-bold text-white">Early Warning System</h2>
          </div>

          {forecastData.warnings.map((warning) => (
            <div
              key={warning.nodeId}
              className="bg-slate-900/50 rounded-lg p-4 mb-3 border border-red-500/30"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-red-400 mb-2">
                    High congestion predicted at {warning.nodeName}
                  </h3>
                  <p className="text-slate-300 mb-2">
                    Predicted stress: <span className="font-bold text-red-400">{warning.predictedStress}</span> in {warning.timeToImpact} minutes
                  </p>
                  <p className="text-yellow-400 text-sm font-semibold">
                    ⚡ {warning.recommendedAction}
                  </p>
                </div>
                <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">
                  Take Action
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Forecast Grid */}
      {forecastData && (
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Forecast Details</h2>
            <div className="text-sm text-slate-400">
              Average Predicted Stress: 
              <span className="ml-2 text-white font-bold text-lg">
                {forecastData.avgPredictedStress}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-slate-700">
                <tr>
                  <th className="pb-3 text-slate-400 font-semibold text-sm">Node</th>
                  <th className="pb-3 text-slate-400 font-semibold text-sm">Predicted Stress</th>
                  <th className="pb-3 text-slate-400 font-semibold text-sm">Confidence</th>
                  <th className="pb-3 text-slate-400 font-semibold text-sm">Range</th>
                  <th className="pb-3 text-slate-400 font-semibold text-sm">Triggers</th>
                </tr>
              </thead>
              <tbody>
                {forecastData.forecast.map((node) => (
                  <tr key={node.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                    <td className="py-3 text-white font-semibold">{node.name}</td>
                    <td className="py-3">
                      <span className={`px-3 py-1 rounded-lg font-bold text-lg ${getStressColor(node.predictedStress)}`}>
                        {node.predictedStress}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-slate-700 rounded-full h-2">
                          <div
                            className="bg-cyan-500 h-2 rounded-full"
                            style={{ width: `${node.confidence}%` }}
                          ></div>
                        </div>
                        <span className="text-slate-300 text-sm">{node.confidence}%</span>
                      </div>
                    </td>
                    <td className="py-3 text-slate-400 text-sm">
                      {node.confidenceRange[0]} - {node.confidenceRange[1]}
                    </td>
                    <td className="py-3">
                      <div className="flex flex-wrap gap-1">
                        {node.triggers.map((trigger, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded"
                          >
                            {trigger}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div>
        </div>
      )}
    </div>
  )
}