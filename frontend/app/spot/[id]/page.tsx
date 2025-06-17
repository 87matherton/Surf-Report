"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { surfSpots } from "../../../src/data/spots";
import dynamic from "next/dynamic";

const WeatherDisplay = dynamic(() => import("../../../src/components/WeatherDisplay"), { ssr: false });
const WaveChart = dynamic(() => import("../../../src/components/WaveChart"), { ssr: false });
const TideChart = dynamic(() => import("../../../src/components/TideChart"), { ssr: false });
const ForecastCalendar = dynamic(() => import("../../../src/components/ForecastCalendar"), { ssr: false });
const BreakInfo = dynamic(() => import("../../../src/components/BreakInfo"), { ssr: false });
const WeatherForecast = dynamic(() => import("../../../src/components/WeatherForecast"), { ssr: false });

// Placeholder Card component
const PlaceholderCard = ({ title, icon, children }: { title: string; icon?: React.ReactNode; children?: React.ReactNode }) => (
  <div className="rounded-lg border bg-muted/50 p-6 flex flex-col items-center justify-center text-center shadow-sm mb-4">
    <div className="text-4xl mb-2">{icon}</div>
    <div className="font-bold text-lg mb-1">{title}</div>
    <div className="text-gray-500 text-sm">{children}</div>
  </div>
);

export default function SpotDetailPage() {
  const params = useParams() as { id: string };
  const router = useRouter();
  const spot = surfSpots.find((s) => s.id === params.id);
  if (!spot) return <div className="p-8 text-center text-lg">Spot not found.</div>;

  // Simulate missing/empty data for demonstration (replace with real checks as needed)
  const hasWeather = !!spot.location;
  const hasWaveData = spot.forecast && spot.forecast.length > 0;
  const hasTide = typeof spot.currentConditions.tide === 'number' || !isNaN(parseFloat(spot.currentConditions.tide));
  const hasForecast = spot.forecast && spot.forecast.length > 0;
  const hasBreakInfo = !!spot.breakInfo;

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <button
        className="mb-4 px-4 py-2 border rounded text-sm hover:bg-gray-100"
        onClick={() => router.back()}
      >
        ← Back to Map
      </button>
      <div className="mb-4">
        <h1 className="text-3xl font-bold mb-1">{spot.name}</h1>
        <div className="text-gray-500 mb-2">Today's Conditions: <b>{spot.conditionsRating}</b></div>
        <div className="mb-2">{spot.description}</div>
        <div className="text-sm text-gray-600">Difficulty: {spot.difficulty}</div>
      </div>

      {/* Weather Display */}
      {hasWeather ? (
        <WeatherDisplay
          lat={spot.location.lat}
          lng={spot.location.lng}
          locationName={spot.name}
        />
      ) : (
        <PlaceholderCard title="Live Weather" icon={<span>🌤️</span>}>
          Live weather data is loading or unavailable.<br />
          <span className="italic">(This is a placeholder for weather info.)</span>
        </PlaceholderCard>
      )}

      {/* Weather Forecast */}
      <WeatherForecast lat={spot.location.lat} lng={spot.location.lng} locationName={spot.name} />

      {/* Wave Chart */}
      {hasWaveData ? (
        <WaveChart
          waveData={spot.forecast.map((f, i) => ({
            time: f.date,
            timeLabel: f.date,
            height: f.swellHeight,
            period: f.swellPeriod,
            direction: f.swellDirection,
            type: null
          }))}
          currentWaveHeight={spot.currentConditions.swellHeight}
          locationName={spot.name}
        />
      ) : (
        <PlaceholderCard title="Wave Chart" icon={<span>🌊</span>}>
          Wave chart data is loading or unavailable.<br />
          <span className="italic">(This is a placeholder for the wave chart.)</span>
        </PlaceholderCard>
      )}

      {/* Tide Chart */}
      {hasTide ? (
        <TideChart
          tideData={[
            { time: '6:00 AM', timeLabel: '6 AM', height: 2.1, type: 'high' },
            { time: '12:00 PM', timeLabel: '12 PM', height: 0.7, type: 'low' },
            { time: '6:00 PM', timeLabel: '6 PM', height: 2.3, type: 'high' },
            { time: '11:59 PM', timeLabel: '11:59 PM', height: 0.5, type: 'low' },
          ]}
          currentTideHeight={typeof spot.currentConditions.tide === 'number' ? spot.currentConditions.tide : parseFloat(spot.currentConditions.tide)}
          locationName={spot.name}
        />
      ) : (
        <TideChart
          tideData={[
            { time: '6:00 AM', timeLabel: '6 AM', height: 2.1, type: 'high' },
            { time: '12:00 PM', timeLabel: '12 PM', height: 0.7, type: 'low' },
            { time: '6:00 PM', timeLabel: '6 PM', height: 2.3, type: 'high' },
            { time: '11:59 PM', timeLabel: '11:59 PM', height: 0.5, type: 'low' },
          ]}
          currentTideHeight={1.2}
          locationName={spot.name}
        />
      )}

      {/* Forecast Calendar */}
      {hasForecast ? (
        <ForecastCalendar
          locationName={spot.name}
          forecast={spot.forecast.map(f => ({
            date: f.date,
            dayName: new Date(f.date).toLocaleDateString('en-US', { weekday: 'short' }),
            weather: {
              condition: 'sunny',
              icon: 'sunny',
              maxTemp: spot.currentConditions.airTemp,
              minTemp: spot.currentConditions.airTemp - 5,
              windSpeed: f.windSpeed,
              windDirection: f.windDirection,
              precipitation: 0,
              description: 'Clear',
            },
            marine: {
              waveHeight: f.swellHeight,
              wavePeriod: f.swellPeriod,
              swellDirection: f.swellDirection,
            },
            tides: [
              { time: '6:00 AM', type: 'high', height: 2.1 },
              { time: '12:00 PM', type: 'low', height: 0.7 },
              { time: '6:00 PM', type: 'high', height: 2.3 },
              { time: '11:59 PM', type: 'low', height: 0.5 },
            ],
          }))}
        />
      ) : (
        <PlaceholderCard title="5-Day Forecast" icon={<span>📅</span>}>
          Forecast data is loading or unavailable.<br />
          <span className="italic">(This is a placeholder for the forecast calendar.)</span>
        </PlaceholderCard>
      )}

      {/* Break Info */}
      {spot.breakInfo ? (
        <BreakInfo spotName={spot.name} breakInfo={spot.breakInfo} />
      ) : (
        <BreakInfo
          spotName={spot.name}
          breakInfo={{
            type: 'Beach',
            waveDirection: 'W',
            bottom: 'Sand',
            peakSections: ['Left', 'Right'],
            hazards: ['Rip currents', 'Rocks'],
            bestTime: 'Morning',
            crowdFactor: 'Low',
            experience: 'All levels welcome. Great for learning and progressing.'
          }}
        />
      )}
    </div>
  );
} 