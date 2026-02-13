'use client'

import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { TrafficNode } from '@/types/traffic'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface StressTimelineProps {
  nodes: TrafficNode[]
}

const colorPalette = [
  '#ef4444', // red
  '#f59e0b', // orange
  '#eab308', // yellow
  '#10b981', // green
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#06b6d4', // cyan
]

export default function StressTimeline({ nodes }: StressTimelineProps) {
  // Get history length from first node
  const historyLength = nodes[0]?.history?.length || 0
  const labels = Array.from({ length: historyLength }, (_, i) => {
    const minutesAgo = (historyLength - i - 1) * 0.5 // 30 seconds = 0.5 minutes
    return minutesAgo > 0 ? `-${minutesAgo.toFixed(1)}m` : 'Now'
  })

  const datasets = nodes.map((node, index) => ({
    label: node.name,
    data: node.history,
    borderColor: colorPalette[index % colorPalette.length],
    backgroundColor: `${colorPalette[index % colorPalette.length]}33`,
    borderWidth: 2,
    tension: 0.4,
    fill: false,
    pointRadius: 0,
    pointHoverRadius: 6,
  }))

  const data = {
    labels,
    datasets,
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#e2e8f0',
          padding: 15,
          font: {
            size: 12,
          },
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#e2e8f0',
        bodyColor: '#e2e8f0',
        borderColor: '#334155',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${context.parsed.y}`
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          color: '#334155',
          drawBorder: false,
        },
        ticks: {
          color: '#94a3b8',
          font: {
            size: 11,
          },
        },
      },
      y: {
        min: 0,
        max: 100,
        grid: {
          color: '#334155',
          drawBorder: false,
        },
        ticks: {
          color: '#94a3b8',
          font: {
            size: 11,
          },
          callback: function(value: any) {
            return value
          }
        },
        title: {
          display: true,
          text: 'Stress Score',
          color: '#94a3b8',
          font: {
            size: 12,
            weight: 'bold',
          },
        },
      },
    },
  }

  return (
    <div className="h-[300px]" data-testid="stress-timeline">
      <Line data={data} options={options as any} />
    </div>
  )
}
