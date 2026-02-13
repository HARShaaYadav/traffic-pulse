import { WeatherData } from "@/types/traffic";

const API_KEY = process.env.NEXT_PUBLIC_WEATHERAPI_KEY?.trim();
const BASE_URL = "https://api.weatherapi.com/v1";
const LOCATION = "Bangalore";

export async function getRealWeather(): Promise<WeatherData> {
  if (!API_KEY) {
    console.warn("Missing WEATHERAPI_KEY, returning default weather.");
    return { condition: "clear", intensity: 0 };
  }

  try {
    const res = await fetch(
      `${BASE_URL}/current.json?key=${API_KEY}&q=${LOCATION}&aqi=no`,
    );

    if (!res.ok) {
      console.error(`WeatherAPI error: ${res.status} ${res.statusText}`);
      return { condition: "clear", intensity: 0 };
    }

    const data = await res.json();
    const conditionText = data.current.condition.text.toLowerCase();
    const precip = data.current.precip_mm || 0;

    let condition: "clear" | "light_rain" | "heavy_rain" = "clear";
    let intensity = 0;

    if (conditionText.includes("rain") || conditionText.includes("drizzle")) {
      if (precip > 2.5) {
        condition = "heavy_rain";
        intensity = Math.min(10, Math.floor(precip * 2)); // Scale intensity
      } else {
        condition = "light_rain";
        intensity = Math.max(1, Math.floor(precip * 5));
      }
    } else if (
      conditionText.includes("storm") ||
      conditionText.includes("thunder")
    ) {
      condition = "heavy_rain";
      intensity = 8;
    }

    return {
      condition,
      intensity,
    };
  } catch (error) {
    console.error("Failed to fetch weather:", error);
    return { condition: "clear", intensity: 0 };
  }
}
