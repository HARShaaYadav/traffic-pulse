'use client'

import { CloudRain, Cloud, Sun } from 'lucide-react'
import { WeatherData } from '@/types/traffic'

interface WeatherWidgetProps {
  weather: WeatherData
}

export default function WeatherWidget({ weather }: WeatherWidgetProps) {
  const getWeatherIcon = () => {
    if (weather.condition === 'heavy_rain') return <CloudRain className="w-5 h-5 text-blue-400" />
    if (weather.condition === 'light_rain') return <Cloud className="w-5 h-5 text-blue-300" />
    return <Sun className="w-5 h-5 text-yellow-400" />
  }

  const getWeatherLabel = () => {
    if (weather.condition === 'heavy_rain') return 'Heavy Rain'
    if (weather.condition === 'light_rain') return 'Light Rain'
    return 'Clear'
  }

  const getWeatherColor = () => {
    if (weather.condition === 'heavy_rain') return 'text-blue-400'
    if (weather.condition === 'light_rain') return 'text-blue-300'
    return 'text-yellow-400'
  }

  return (
    <div className="flex items-center space-x-3" data-testid="weather-widget">
      {getWeatherIcon()}
      <div>
        <div className={`text-sm font-semibold ${getWeatherColor()}`}>
          {getWeatherLabel()}
        </div>
        {weather.intensity > 0 && (
          <div className="text-xs text-slate-500">Intensity: {weather.intensity}/10</div>
        )}
      </div>
    </div>
  )
}
