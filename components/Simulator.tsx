'use client'

import { useState } from 'react'
import { Play, AlertCircle } from 'lucide-react'
import { SimulationResult } from '@/types/traffic'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function Simulator() {
  const [trigger, setTrigger] = useState('Heavy Rain')
  const [location, setLocation] = useState('silk_board')
  const [intervention, setIntervention] = useState('none')
  const [timeHorizon, setTimeHorizon] = useState('1hr')
  const [result, setResult] = useState<SimulationResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const nodes = [
    { id: 'silk_board', name: 'Silk Board' },
    { id: 'marathahalli', name: 'Marathahalli' },
    { id: 'brookefield', name: 'Brookefield' },
    { id: 'bellandur', name: 'Bellandur' },
    { id: 'ecospace', name: 'Ecospace' },
    { id: 'whitefield', name: 'Whitefield' },
    { id: 'sarjapur', name: 'Sarjapur Road' },
    { id: 'kr_puram', name: 'KR Puram' },
  ]

  const runSimulation = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const res = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trigger, location, intervention, timeHorizon }),
      })
      
      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`)
      }
      
      const data = await res.json()
      
      if (!data || !data.without || !data.with) {
        throw new Error('Invalid response format')
      }
      
      setResult(data)
    } catch (error: any) {
      console.error('Simulation failed:', error)
      setError(error.message || 'Simulation failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getChartData = (nodes: { name: string; stress: number }[]) => ({
    labels: nodes.map(n => n.name),
    datasets: [{
      label: 'Stress Level',
      data: nodes.map(n => n.stress),
      backgroundColor: nodes.map(n =>
        n.stress > 0.8 ? 'rgba(239, 68, 68, 0.8)' :
        n.stress > 0.6 ? 'rgba(251, 146, 60, 0.8)' :
        'rgba(34, 197, 94, 0.8)'
      ),
    }],
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Traffic Scenario Simulator</h1>
        <p className="text-slate-400">Test "What-If" scenarios and intervention strategies</p>
      </div>

      {/* Input Panel */}
      <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
        <h2 className="text-xl font-bold text-white mb-4">Simulation Parameters</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Event Trigger</label>
            <select
              value={trigger}
              onChange={(e) => setTrigger(e.target.value)}
              className="w-full px-4 py-2 bg-slate-800 text-white rounded-lg border border-slate-700 focus:border-cyan-500 focus:outline-none"
            >
              <option value="Heavy Rain">Heavy Rain</option>
              <option value="Major Accident">Major Accident</option>
              <option value="Road Closure">Road Closure</option>
              <option value="VIP Movement">VIP Movement</option>
              <option value="Festival Rush">Festival Rush</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Location</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2 bg-slate-800 text-white rounded-lg border border-slate-700 focus:border-cyan-500 focus:outline-none"
            >
              {nodes.map(node => (
                <option key={node.id} value={node.id}>{node.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Intervention</label>
            <select
              value={intervention}
              onChange={(e) => setIntervention(e.target.value)}
              className="w-full px-4 py-2 bg-slate-800 text-white rounded-lg border border-slate-700 focus:border-cyan-500 focus:outline-none"
            >
              <option value="none">No Intervention</option>
              <option value="signal_timing">Signal Timing Adjustment</option>
              <option value="route_diversion">Route Diversion</option>
              <option value="traffic_police">Deploy Traffic Police</option>
              <option value="public_alert">Public Alert System</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Time Horizon</label>
            <select
              value={timeHorizon}
              onChange={(e) => setTimeHorizon(e.target.value)}
              className="w-full px-4 py-2 bg-slate-800 text-white rounded-lg border border-slate-700 focus:border-cyan-500 focus:outline-none"
            >
              <option value="30min">30 Minutes</option>
              <option value="1hr">1 Hour</option>
              <option value="2hr">2 Hours</option>
              <option value="4hr">4 Hours</option>
            </select>
          </div>
        </div>

        <button
          onClick={runSimulation}
          disabled={loading}
          className="mt-6 w-full md:w-auto px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              <span>Running Simulation...</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              <span>Run Simulation</span>
            </>
          )}
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500 rounded-lg flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-400">{error}</span>
          </div>
        )}
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Recommendation */}
          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-lg p-6">
            <h3 className="text-lg font-bold text-cyan-400 mb-2">AI Recommendation</h3>
            <p className="text-white">{result.recommendation}</p>
          </div>

          {/* Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
              <h3 className="text-xl font-bold text-white mb-4">Without Intervention</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Total Delay</span>
                  <span className="text-2xl font-bold text-red-400">{result.without.totalDelay} min</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Affected Nodes</span>
                  <span className="text-2xl font-bold text-orange-400">{result.without.affectedNodes}</span>
                </div>
                <Bar
                  data={getChartData(result.without.nodes)}
                  options={{
                    responsive: true,
                    scales: {
                      y: { beginAtZero: true, max: 1, ticks: { color: '#94a3b8' } },
                      x: { ticks: { color: '#94a3b8', font: { size: 10 } } },
                    },
                    plugins: { legend: { display: false } },
                  }}
                />
              </div>
            </div>

            <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
              <h3 className="text-xl font-bold text-white mb-4">With Intervention</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Total Delay</span>
                  <span className="text-2xl font-bold text-green-400">{result.with.totalDelay} min</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Affected Nodes</span>
                  <span className="text-2xl font-bold text-green-400">{result.with.affectedNodes}</span>
                </div>
                <Bar
                  data={getChartData(result.with.nodes)}
                  options={{
                    responsive: true,
                    scales: {
                      y: { beginAtZero: true, max: 1, ticks: { color: '#94a3b8' } },
                      x: { ticks: { color: '#94a3b8', font: { size: 10 } } },
                    },
                    plugins: { legend: { display: false } },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
