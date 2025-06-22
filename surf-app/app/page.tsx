import React from 'react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600">
      {/* Header */}
      <div className="p-6">
        <h1 className="text-white text-3xl font-bold">WaveCheck - TEST</h1>
        <p className="text-blue-100">Surf Report</p>
      </div>

      {/* Main Content */}
      <div className="px-6 py-12">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Current Conditions</h2>
          
          {/* Sample Surf Spot */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-lg text-gray-800">Malibu</h3>
            <p className="text-gray-600 text-sm">California</p>
            
            <div className="flex items-center justify-between mt-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">4ft</div>
                <div className="text-xs text-gray-500">waves</div>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-700">12mph SW</div>
                <div className="text-xs text-gray-500">wind</div>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-700">68°</div>
                <div className="text-xs text-gray-500">temp</div>
              </div>
            </div>
            
            <div className="mt-3">
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                Good conditions
              </span>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="space-y-2">
            <button className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors">
              View All Spots
            </button>
            <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors">
              Favorites
            </button>
            <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors">
              Forecast
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 