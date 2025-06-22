import React from "react";
import { useForecastData } from "../hooks/useForecastData";

interface WeatherDay {
  date: string;
  dayName: string;
  icon: string; // e.g. 'sunny', 'cloudy', 'rainy'
  maxTemp: number;
  minTemp: number;
  windSpeed: number;
  windDirection: string;
  description: string;
}

interface WeatherForecastProps {
  lat?: number;
  lng?: number;
  locationName?: string;
}

const iconMap: Record<string, React.ReactNode> = {
  sunny: <span role="img" aria-label="Sunny">☀️</span>,
  cloudy: <span role="img" aria-label="Cloudy">☁️</span>,
  rainy: <span role="img" aria-label="Rainy">🌧️</span>,
  partlycloudy: <span role="img" aria-label="Partly Cloudy">⛅</span>,
  storm: <span role="img" aria-label="Storm">⛈️</span>,
  snow: <span role="img" aria-label="Snow">❄️</span>,
};

const getIcon = (icon: string) => iconMap[icon.toLowerCase()] || iconMap["sunny"];

const placeholderForecast: WeatherDay[] = [
  { date: "2024-06-12", dayName: "Wed", icon: "sunny", maxTemp: 22, minTemp: 15, windSpeed: 12, windDirection: "NW", description: "Clear and sunny" },
  { date: "2024-06-13", dayName: "Thu", icon: "partlycloudy", maxTemp: 20, minTemp: 14, windSpeed: 10, windDirection: "W", description: "Partly cloudy" },
  { date: "2024-06-14", dayName: "Fri", icon: "cloudy", maxTemp: 18, minTemp: 13, windSpeed: 14, windDirection: "SW", description: "Cloudy" },
  { date: "2024-06-15", dayName: "Sat", icon: "rainy", maxTemp: 16, minTemp: 12, windSpeed: 18, windDirection: "S", description: "Showers" },
  { date: "2024-06-16", dayName: "Sun", icon: "sunny", maxTemp: 21, minTemp: 14, windSpeed: 9, windDirection: "NW", description: "Sunny" },
];

const WeatherForecast: React.FC<WeatherForecastProps> = ({ lat, lng, locationName }) => {
  const { forecast, loading, error } = useForecastData(lat || 0, lng || 0);

  // Map real forecast data to WeatherDay format
  const weatherDays: WeatherDay[] =
    forecast && forecast.length > 0
      ? forecast.map((day) => ({
          date: day.date,
          dayName: day.dayName,
          icon: day.weather.icon,
          maxTemp: Math.round(day.weather.maxTemp),
          minTemp: Math.round(day.weather.minTemp),
          windSpeed: Math.round(day.weather.windSpeed),
          windDirection: day.weather.windDirection,
          description: day.weather.description,
        }))
      : placeholderForecast;

  return (
    <div className="rounded-lg border bg-muted/50 p-4 shadow-sm mb-4">
      <div className="font-bold text-lg mb-2 text-center">🌦️ 5-Day Weather Forecast{locationName ? ` - ${locationName}` : ""}</div>
      {loading ? (
        <div className="text-center text-gray-500 py-6">Loading weather forecast...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-6">{error}</div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-6">
            {weatherDays.map((day) => (
              <div key={day.date} className="flex flex-col items-center bg-white/80 rounded p-3 shadow">
                <div className="text-xl mb-1">{getIcon(day.icon)}</div>
                <div className="font-semibold text-sm mb-1">{day.dayName}</div>
                <div className="text-xs text-gray-500 mb-1">{day.date}</div>
                <div className="text-base font-bold mb-1">{day.maxTemp}° / {day.minTemp}°</div>
                <div className="text-xs text-blue-600 mb-1">💨 {day.windSpeed} km/h {day.windDirection}</div>
                <div className="text-xs text-gray-600 text-center">{day.description}</div>
              </div>
            ))}
          </div>
          {/* Table view */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border rounded-lg bg-white/80">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-3 py-2 text-left font-semibold">Day</th>
                  <th className="px-3 py-2 text-left font-semibold">Date</th>
                  <th className="px-3 py-2 text-left font-semibold">Icon</th>
                  <th className="px-3 py-2 text-left font-semibold">High / Low Temp</th>
                  <th className="px-3 py-2 text-left font-semibold">High Tide</th>
                  <th className="px-3 py-2 text-left font-semibold">Low Tide</th>
                  <th className="px-3 py-2 text-left font-semibold">Description</th>
                </tr>
              </thead>
              <tbody>
                {forecast && forecast.length > 0 ? forecast.map((day) => {
                  // Find first high and low tide for the day
                  const highTide = day.tides?.find(t => t.type === 'high');
                  const lowTide = day.tides?.find(t => t.type === 'low');
                  return (
                    <tr key={day.date} className="border-t">
                      <td className="px-3 py-2 font-medium">{day.dayName}</td>
                      <td className="px-3 py-2">{day.date}</td>
                      <td className="px-3 py-2 text-xl">{getIcon(day.weather.icon)}</td>
                      <td className="px-3 py-2">{Math.round(day.weather.maxTemp)}° / {Math.round(day.weather.minTemp)}°</td>
                      <td className="px-3 py-2">{highTide ? `${highTide.time} (${highTide.height}m)` : '--'}</td>
                      <td className="px-3 py-2">{lowTide ? `${lowTide.time} (${lowTide.height}m)` : '--'}</td>
                      <td className="px-3 py-2">{day.weather.description}</td>
                    </tr>
                  );
                }) : null}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default WeatherForecast; 