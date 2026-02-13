"use client";

import { useState, useEffect } from "react";
import {
  Cloud,
  CloudRain,
  Sun,
  Droplets,
  Wind,
  Thermometer,
  Eye,
  TrendingUp,
  AlertTriangle,
  Umbrella,
  Gauge,
} from "lucide-react";

interface LiveWeather {
  temp_c: number;
  feelslike_c: number;
  humidity: number;
  wind_kph: number;
  precip_mm: number;
  vis_km: number;
  condition: string;
  condition_icon: string;
  uv: number;
  cloud: number;
  pressure_mb: number;
  gust_kph: number;
  last_updated: string;
}

interface ForecastHour {
  time: string;
  temp_c: number;
  condition: string;
  chance_of_rain: number;
  precip_mm: number;
  wind_kph: number;
}

interface TrafficImpact {
  node: string;
  stress: number;
  speed: number;
  normal_speed: number;
}

export default function WeatherImpact() {
  const [weather, setWeather] = useState<LiveWeather | null>(null);
  const [forecast, setForecast] = useState<ForecastHour[]>([]);
  const [trafficNodes, setTrafficNodes] = useState<TrafficImpact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeatherData();
    fetchTrafficData();
    const interval = setInterval(() => {
      fetchWeatherData();
      fetchTrafficData();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  async function fetchWeatherData() {
    try {
      const res = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${process.env.NEXT_PUBLIC_WEATHERAPI_KEY || "6df3b983d0414c328af192733261202"}&q=Bangalore&days=1&aqi=yes`,
      );
      const data = await res.json();
      if (data.current) {
        setWeather({
          temp_c: data.current.temp_c,
          feelslike_c: data.current.feelslike_c,
          humidity: data.current.humidity,
          wind_kph: data.current.wind_kph,
          precip_mm: data.current.precip_mm,
          vis_km: data.current.vis_km,
          condition: data.current.condition.text,
          condition_icon: data.current.condition.icon,
          uv: data.current.uv,
          cloud: data.current.cloud,
          pressure_mb: data.current.pressure_mb,
          gust_kph: data.current.gust_kph,
          last_updated: data.current.last_updated,
        });
        // Extract hourly forecast (next 6 hours)
        if (data.forecast?.forecastday?.[0]?.hour) {
          const currentHour = new Date().getHours();
          const nextHours = data.forecast.forecastday[0].hour
            .filter((h: any) => {
              const hourNum = parseInt(h.time.split(" ")[1].split(":")[0]);
              return hourNum >= currentHour && hourNum <= currentHour + 6;
            })
            .slice(0, 6)
            .map((h: any) => ({
              time: h.time.split(" ")[1],
              temp_c: h.temp_c,
              condition: h.condition.text,
              chance_of_rain: h.chance_of_rain,
              precip_mm: h.precip_mm,
              wind_kph: h.wind_kph,
            }));
          setForecast(nextHours);
        }
      }
    } catch (e) {
      console.error("Weather fetch error:", e);
    } finally {
      setLoading(false);
    }
  }

  async function fetchTrafficData() {
    try {
      const res = await fetch("/api/traffic");
      const data = await res.json();
      if (data.nodes) {
        setTrafficNodes(
          data.nodes.map((n: any) => ({
            node: n.name,
            stress: n.stress || n.stress_score || 0,
            speed: n.current_speed || n.speed || 0,
            normal_speed: n.normal_speed || 45,
          })),
        );
      }
    } catch (e) {
      console.error("Traffic fetch error:", e);
    }
  }

  const getWeatherIcon = (condition: string) => {
    const lower = condition.toLowerCase();
    if (lower.includes("rain") || lower.includes("drizzle"))
      return <CloudRain className="w-6 h-6 text-blue-400" />;
    if (lower.includes("cloud") || lower.includes("overcast"))
      return <Cloud className="w-6 h-6 text-slate-400" />;
    return <Sun className="w-6 h-6 text-yellow-400" />;
  };

  const getImpactLevel = () => {
    if (!weather)
      return {
        label: "Unknown",
        color: "text-slate-400",
        bg: "bg-slate-500/20 border-slate-500/30",
      };
    const precip = weather.precip_mm;
    const vis = weather.vis_km;
    const wind = weather.wind_kph;

    if (precip > 5 || vis < 2 || wind > 40) {
      return {
        label: "Severe",
        color: "text-red-400",
        bg: "bg-red-500/20 border-red-500/30",
      };
    }
    if (precip > 2 || vis < 5 || wind > 25) {
      return {
        label: "Moderate",
        color: "text-orange-400",
        bg: "bg-orange-500/20 border-orange-500/30",
      };
    }
    if (precip > 0.5 || vis < 8) {
      return {
        label: "Minor",
        color: "text-yellow-400",
        bg: "bg-yellow-500/20 border-yellow-500/30",
      };
    }
    return {
      label: "None",
      color: "text-green-400",
      bg: "bg-green-500/20 border-green-500/30",
    };
  };

  const getSpeedReductionFactor = () => {
    if (!weather) return 0;
    let factor = 0;
    if (weather.precip_mm > 5) factor += 25;
    else if (weather.precip_mm > 2) factor += 15;
    else if (weather.precip_mm > 0.5) factor += 8;

    if (weather.vis_km < 2) factor += 20;
    else if (weather.vis_km < 5) factor += 10;

    if (weather.wind_kph > 40) factor += 10;
    else if (weather.wind_kph > 25) factor += 5;

    return Math.min(factor, 50);
  };

  const impact = getImpactLevel();
  const speedReduction = getSpeedReductionFactor();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="text-center py-20 text-slate-400">
        <CloudRain className="w-16 h-16 mx-auto mb-4 opacity-50" />
        <p>Unable to fetch weather data. Check WEATHERAPI_KEY in .env.local</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white font-space-grotesk mb-2">
          Weather Impact Analysis
        </h1>
        <p className="text-slate-400">
          Real-time weather conditions and their effect on ORR corridor traffic
        </p>
      </div>

      {/* Current Conditions Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Weather Card */}
        <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl border border-slate-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">
              Current Conditions — Bangalore
            </h2>
            <span className="text-xs text-slate-500">
              Updated: {weather.last_updated}
            </span>
          </div>
          <div className="flex items-center gap-8">
            <div className="text-center">
              {weather.condition_icon ? (
                <img
                  src={`https:${weather.condition_icon}`}
                  alt={weather.condition}
                  className="w-20 h-20 mx-auto"
                />
              ) : (
                <Sun className="w-20 h-20 text-yellow-400 mx-auto" />
              )}
              <div className="text-white font-semibold mt-1">
                {weather.condition}
              </div>
            </div>
            <div>
              <div className="text-6xl font-bold text-white">
                {weather.temp_c}°
              </div>
              <div className="text-slate-400 text-sm">
                Feels like {weather.feelslike_c}°C
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3 ml-auto">
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-blue-400" />
                <span className="text-slate-300 text-sm">
                  Humidity:{" "}
                  <span className="text-white font-semibold">
                    {weather.humidity}%
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Wind className="w-4 h-4 text-cyan-400" />
                <span className="text-slate-300 text-sm">
                  Wind:{" "}
                  <span className="text-white font-semibold">
                    {weather.wind_kph} km/h
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-purple-400" />
                <span className="text-slate-300 text-sm">
                  Visibility:{" "}
                  <span className="text-white font-semibold">
                    {weather.vis_km} km
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Umbrella className="w-4 h-4 text-blue-300" />
                <span className="text-slate-300 text-sm">
                  Precip:{" "}
                  <span className="text-white font-semibold">
                    {weather.precip_mm} mm
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Cloud className="w-4 h-4 text-slate-400" />
                <span className="text-slate-300 text-sm">
                  Cloud:{" "}
                  <span className="text-white font-semibold">
                    {weather.cloud}%
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-orange-400" />
                <span className="text-slate-300 text-sm">
                  Pressure:{" "}
                  <span className="text-white font-semibold">
                    {weather.pressure_mb} mb
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Traffic Impact Card */}
        <div className={`rounded-xl border p-6 ${impact.bg}`}>
          <h2 className="text-lg font-bold text-white mb-3">Traffic Impact</h2>
          <div className="text-center mb-4">
            <AlertTriangle
              className={`w-12 h-12 mx-auto mb-2 ${impact.color}`}
            />
            <div className={`text-3xl font-bold ${impact.color}`}>
              {impact.label}
            </div>
            <div className="text-slate-400 text-sm mt-1">
              Weather Impact Level
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">Speed Reduction</span>
              <span className="text-white font-bold">{speedReduction}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-1000 ${
                  speedReduction > 30
                    ? "bg-red-500"
                    : speedReduction > 15
                      ? "bg-orange-500"
                      : speedReduction > 5
                        ? "bg-yellow-500"
                        : "bg-green-500"
                }`}
                style={{ width: `${Math.min(speedReduction, 100)}%` }}
              />
            </div>
            <div className="text-xs text-slate-500 mt-2">
              Estimated speed reduction due to current weather
            </div>
          </div>
        </div>
      </div>

      {/* Hourly Forecast */}
      {forecast.length > 0 && (
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
          <h2 className="text-xl font-bold text-white mb-4">Hourly Forecast</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {forecast.map((hour, i) => (
              <div
                key={i}
                className="bg-slate-800 rounded-lg p-4 text-center hover:border-cyan-500 border border-slate-700 transition"
              >
                <div className="text-slate-400 text-sm font-semibold mb-2">
                  {hour.time}
                </div>
                {getWeatherIcon(hour.condition)}
                <div className="text-white font-bold text-lg mt-1">
                  {hour.temp_c}°
                </div>
                <div className="text-slate-500 text-xs mt-1 truncate">
                  {hour.condition}
                </div>
                {hour.chance_of_rain > 0 && (
                  <div className="text-blue-400 text-xs mt-1 flex items-center justify-center gap-1">
                    <Droplets className="w-3 h-3" /> {hour.chance_of_rain}%
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weather-Traffic Correlation */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
        <h2 className="text-xl font-bold text-white mb-4">
          Weather–Traffic Correlation
          <span className="text-sm font-normal text-slate-400 ml-2">
            Current conditions impact on each node
          </span>
        </h2>
        <div className="space-y-3">
          {trafficNodes.map((node, i) => {
            const adjustedSpeed = Math.round(
              node.speed * (1 - speedReduction / 100),
            );
            const weatherStress = Math.min(100, node.stress + speedReduction);
            return (
              <div
                key={i}
                className="bg-slate-800 rounded-lg p-4 border border-slate-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-semibold">{node.node}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-slate-400 text-sm">
                      Speed:{" "}
                      <span className="text-cyan-400 font-bold">
                        {node.speed}
                      </span>
                      <span className="text-slate-500"> → </span>
                      <span
                        className={`font-bold ${adjustedSpeed < node.speed ? "text-orange-400" : "text-green-400"}`}
                      >
                        {adjustedSpeed}
                      </span>
                      <span className="text-slate-500"> km/h</span>
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        weatherStress > 70
                          ? "bg-red-500/20 text-red-400"
                          : weatherStress > 40
                            ? "bg-orange-500/20 text-orange-400"
                            : "bg-green-500/20 text-green-400"
                      }`}
                    >
                      {weatherStress}% stress
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="flex-1 bg-slate-700 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all ${
                        node.stress > 70
                          ? "bg-red-500"
                          : node.stress > 40
                            ? "bg-orange-500"
                            : "bg-green-500"
                      }`}
                      style={{ width: `${node.stress}%` }}
                    />
                  </div>
                  <TrendingUp
                    className={`w-3 h-3 ${speedReduction > 10 ? "text-red-400" : "text-slate-600"}`}
                  />
                  <div className="flex-1 bg-slate-700 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all ${
                        weatherStress > 70
                          ? "bg-red-500"
                          : weatherStress > 40
                            ? "bg-orange-500"
                            : "bg-green-500"
                      }`}
                      style={{ width: `${weatherStress}%` }}
                    />
                  </div>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-slate-500">Current stress</span>
                  <span className="text-xs text-slate-500">
                    With weather impact
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weather Thresholds */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
        <h2 className="text-xl font-bold text-white mb-4">
          Weather Alert Thresholds
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            className={`rounded-lg border p-4 ${
              weather.precip_mm > 5
                ? "bg-red-500/10 border-red-500/30"
                : weather.precip_mm > 2
                  ? "bg-orange-500/10 border-orange-500/30"
                  : "bg-slate-800 border-slate-700"
            }`}
          >
            <CloudRain
              className={`w-8 h-8 mb-2 ${
                weather.precip_mm > 5
                  ? "text-red-400"
                  : weather.precip_mm > 2
                    ? "text-orange-400"
                    : "text-slate-500"
              }`}
            />
            <div className="text-white font-bold text-lg">Rainfall</div>
            <div className="text-slate-400 text-sm mb-3">
              Current: {weather.precip_mm} mm
            </div>
            <div className="space-y-1 text-xs">
              <div
                className={`flex justify-between ${weather.precip_mm > 5 ? "text-red-400 font-bold" : "text-slate-500"}`}
              >
                <span>{">"} 5mm — Severe</span>
                <span>-25% speed</span>
              </div>
              <div
                className={`flex justify-between ${weather.precip_mm > 2 && weather.precip_mm <= 5 ? "text-orange-400 font-bold" : "text-slate-500"}`}
              >
                <span>2-5mm — Moderate</span>
                <span>-15% speed</span>
              </div>
              <div
                className={`flex justify-between ${weather.precip_mm > 0.5 && weather.precip_mm <= 2 ? "text-yellow-400 font-bold" : "text-slate-500"}`}
              >
                <span>0.5-2mm — Light</span>
                <span>-8% speed</span>
              </div>
            </div>
          </div>

          <div
            className={`rounded-lg border p-4 ${
              weather.vis_km < 2
                ? "bg-red-500/10 border-red-500/30"
                : weather.vis_km < 5
                  ? "bg-orange-500/10 border-orange-500/30"
                  : "bg-slate-800 border-slate-700"
            }`}
          >
            <Eye
              className={`w-8 h-8 mb-2 ${
                weather.vis_km < 2
                  ? "text-red-400"
                  : weather.vis_km < 5
                    ? "text-orange-400"
                    : "text-slate-500"
              }`}
            />
            <div className="text-white font-bold text-lg">Visibility</div>
            <div className="text-slate-400 text-sm mb-3">
              Current: {weather.vis_km} km
            </div>
            <div className="space-y-1 text-xs">
              <div
                className={`flex justify-between ${weather.vis_km < 2 ? "text-red-400 font-bold" : "text-slate-500"}`}
              >
                <span>{"<"} 2km — Dangerous</span>
                <span>-20% speed</span>
              </div>
              <div
                className={`flex justify-between ${weather.vis_km >= 2 && weather.vis_km < 5 ? "text-orange-400 font-bold" : "text-slate-500"}`}
              >
                <span>2-5km — Poor</span>
                <span>-10% speed</span>
              </div>
              <div
                className={`flex justify-between ${weather.vis_km >= 5 && weather.vis_km < 8 ? "text-yellow-400 font-bold" : "text-slate-500"}`}
              >
                <span>5-8km — Fair</span>
                <span>-5% speed</span>
              </div>
            </div>
          </div>

          <div
            className={`rounded-lg border p-4 ${
              weather.wind_kph > 40
                ? "bg-red-500/10 border-red-500/30"
                : weather.wind_kph > 25
                  ? "bg-orange-500/10 border-orange-500/30"
                  : "bg-slate-800 border-slate-700"
            }`}
          >
            <Wind
              className={`w-8 h-8 mb-2 ${
                weather.wind_kph > 40
                  ? "text-red-400"
                  : weather.wind_kph > 25
                    ? "text-orange-400"
                    : "text-slate-500"
              }`}
            />
            <div className="text-white font-bold text-lg">Wind Speed</div>
            <div className="text-slate-400 text-sm mb-3">
              Current: {weather.wind_kph} km/h (gusts {weather.gust_kph})
            </div>
            <div className="space-y-1 text-xs">
              <div
                className={`flex justify-between ${weather.wind_kph > 40 ? "text-red-400 font-bold" : "text-slate-500"}`}
              >
                <span>{">"} 40 km/h — High</span>
                <span>-10% speed</span>
              </div>
              <div
                className={`flex justify-between ${weather.wind_kph > 25 && weather.wind_kph <= 40 ? "text-orange-400 font-bold" : "text-slate-500"}`}
              >
                <span>25-40 km/h — Moderate</span>
                <span>-5% speed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
