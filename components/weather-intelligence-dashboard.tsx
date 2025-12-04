"use client"

import { useState } from "react"
import {
  Cloud,
  CloudRain,
  Droplets,
  Wind,
  RefreshCw,
  ChevronDown,
  AlertCircle,
  AlertTriangle,
  Eye,
  Activity,
  Loader,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function WeatherIntelligenceDashboard() {
  const [selectedLocation, setSelectedLocation] = useState("Mangaluru")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isLoadingMap, setIsLoadingMap] = useState(true)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1500)
  }

  const forecastData = [
    {
      date: "Oct 7",
      day: "Tuesday",
      temp: "24° - 29°C",
      condition: "Partly cloudy",
      precip: "10%",
      confidence: "85%",
      icon: Cloud,
    },
    {
      date: "Oct 8",
      day: "Wednesday",
      temp: "22° - 27°C",
      condition: "Heavy rain",
      precip: "85%",
      confidence: "92%",
      icon: CloudRain,
    },
    {
      date: "Oct 9",
      day: "Thursday",
      temp: "21° - 26°C",
      condition: "Thunderstorms",
      precip: "90%",
      confidence: "88%",
      icon: CloudRain,
    },
    {
      date: "Oct 10",
      day: "Friday",
      temp: "23° - 28°C",
      condition: "Rainy",
      precip: "75%",
      confidence: "86%",
      icon: CloudRain,
    },
    {
      date: "Oct 11",
      day: "Saturday",
      temp: "25° - 30°C",
      condition: "Partly cloudy",
      precip: "20%",
      confidence: "84%",
      icon: Cloud,
    },
  ]

  return (
    <div className="min-h-screen bg-slate-900 p-6 text-foreground">
      {/* Header Section */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-4xl font-bold text-transparent">
            AI-Powered Weather Intelligence
          </h1>
          <p className="mt-2 text-gray-400">
            Advanced predictions using machine learning models trained on regional data
          </p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="appearance-none rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 pr-10 text-white focus:border-blue-500 focus:outline-none"
            >
              <option>Mangaluru</option>
              <option>Bangalore</option>
              <option>Mysore</option>
              <option>Belgaum</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <Button
            onClick={handleRefresh}
            variant="outline"
            className="border-slate-700 hover:bg-slate-800 bg-transparent"
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </div>

      {/* Tabs for Dashboard and Live Data */}
      <div className="mb-6 flex gap-2 border-b border-slate-700">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`px-4 py-2 font-semibold transition-colors ${
            activeTab === "dashboard" ? "border-b-2 border-blue-500 text-blue-400" : "text-gray-400 hover:text-white"
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab("live")}
          className={`px-4 py-2 font-semibold transition-colors ${
            activeTab === "live" ? "border-b-2 border-blue-500 text-blue-400" : "text-gray-400 hover:text-white"
          }`}
        >
          Live Data
        </button>
      </div>

      {/* Dashboard Tab */}
      {activeTab === "dashboard" && (
        <>
          {/* Hero Section */}
          <div className="mb-8 rounded-lg border border-slate-700 bg-gradient-to-br from-blue-950 to-slate-900 p-6">
            {/* Header with location and confidence */}
            <div className="mb-6 flex items-center justify-between border-b border-slate-700 pb-4">
              <div>
                <h2 className="text-3xl font-bold">{selectedLocation}</h2>
                <p className="text-sm text-gray-400">Dakshina Kannada, Karnataka</p>
              </div>
              <div className="flex items-center gap-4 text-right">
                <div>
                  <div className="inline-block rounded-full bg-blue-900 px-3 py-1 text-sm font-semibold text-blue-200">
                    80% Confidence
                  </div>
                  <p className="mt-2 text-xs text-gray-400">Updated: 10:23 PM</p>
                </div>
              </div>
            </div>

            {/* Two-column layout */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Left Column - Current Conditions */}
              <div>
                {/* Status Card */}
                <Card className="mb-6 border-slate-700 bg-slate-800">
                  <CardContent className="flex gap-4 pt-6">
                    <Cloud className="h-16 w-16 flex-shrink-0 text-blue-400" />
                    <div>
                      <p className="text-sm font-semibold">
                        Partly cloudy and fair weather today with no rainfall observed.
                      </p>
                      <p className="mt-2 text-xs text-gray-400">
                        IMD forecasts heavy rain, thunderstorms, and lightning expected from Oct 8-10.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Metrics Grid */}
                <div className="mb-6 grid grid-cols-2 gap-4">
                  <Card className="border-slate-700 bg-slate-800">
                    <CardContent className="flex items-center gap-3 pt-6">
                      <Droplets className="h-8 w-8 text-orange-400" />
                      <div>
                        <p className="text-xs text-gray-400">Precipitation</p>
                        <p className="text-xl font-bold">0%</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-slate-700 bg-slate-800">
                    <CardContent className="flex items-center gap-3 pt-6">
                      <Activity className="h-8 w-8 text-red-400" />
                      <div>
                        <p className="text-xs text-gray-400">Temperature</p>
                        <p className="text-lg font-bold">24° - 29°C</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-slate-700 bg-slate-800">
                    <CardContent className="flex items-center gap-3 pt-6">
                      <Droplets className="h-8 w-8 text-blue-400" />
                      <div>
                        <p className="text-xs text-gray-400">Humidity</p>
                        <p className="text-xl font-bold">83%</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-slate-700 bg-slate-800">
                    <CardContent className="flex items-center gap-3 pt-6">
                      <Wind className="h-8 w-8 text-cyan-400" />
                      <div>
                        <p className="text-xs text-gray-400">Wind</p>
                        <p className="text-lg font-bold">13 km/h N</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Alerts */}
                <div className="space-y-3">
                  <Card className="border-yellow-600 border-l-4 bg-slate-800">
                    <CardContent className="flex gap-3 pt-6">
                      <AlertCircle className="h-5 w-5 flex-shrink-0 text-yellow-500" />
                      <p className="text-sm text-yellow-200">No active warnings for the next 48 hours.</p>
                    </CardContent>
                  </Card>
                  <Card className="border-orange-600 border-l-4 bg-slate-800">
                    <CardContent className="flex gap-3 pt-6">
                      <AlertTriangle className="h-5 w-5 flex-shrink-0 text-orange-500" />
                      <p className="text-sm text-orange-200">Forecast: Heavy rain expected from Oct 8-10 (IMD).</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Right Column - AI Model Details */}
              <Card className="border-slate-600 bg-slate-800">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-purple-400" />
                    <CardTitle className="text-lg">AI Model Details</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-400">Model</p>
                    <p className="text-lg font-bold text-white">DeepWeather-CNN</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Type</p>
                    <p className="text-sm text-gray-300">Convolutional Neural Network trained on regional data.</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Specialization</p>
                    <p className="text-sm text-gray-300">Coastal weather patterns</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="rounded-lg bg-slate-700 p-3">
                      <p className="text-xs text-gray-400">Accuracy</p>
                      <p className="text-lg font-bold text-green-400">92%</p>
                    </div>
                    <div className="rounded-lg bg-slate-700 p-3">
                      <p className="text-xs text-gray-400">Confidence</p>
                      <p className="text-lg font-bold text-blue-400">85%</p>
                    </div>
                  </div>
                  <p className="border-t border-slate-600 pt-4 text-xs text-gray-400">
                    This prediction is based on machine learning models trained on historical weather data specific to
                    the Karnataka region.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* 5-Day Forecast Section */}
          <div className="mb-8">
            <h3 className="mb-4 text-2xl font-bold">5-Day Forecast</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {forecastData.map((day, idx) => {
                const IconComponent = day.icon
                return (
                  <Card key={idx} className="border-slate-700 bg-slate-800">
                    <CardContent className="space-y-3 pt-6">
                      <div>
                        <p className="text-xs font-semibold text-gray-400">{day.day}</p>
                        <p className="text-sm font-bold">{day.date}</p>
                      </div>
                      <IconComponent className="h-8 w-8 text-blue-400" />
                      <div>
                        <p className="text-xs text-gray-400">Temperature</p>
                        <p className="text-sm font-bold">{day.temp}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">{day.condition}</p>
                        <p className="text-xs text-gray-500">Precip: {day.precip}</p>
                        <p className="text-xs text-blue-400">Confidence: {day.confidence}</p>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Footer Button */}
          <div className="flex justify-center">
            <Button variant="outline" className="border-slate-600 hover:bg-slate-800 bg-transparent">
              View AI Model Insights
            </Button>
          </div>
        </>
      )}

      {activeTab === "live" && (
        <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Live Precipitation Map</h2>
              <p className="text-sm text-gray-400">Real-time satellite precipitation data from Zoom Earth</p>
            </div>
            <div className="rounded-full bg-blue-900 px-3 py-1 text-sm font-semibold text-blue-200">Live</div>
          </div>

          {/* Loading State */}
          {isLoadingMap && (
            <div className="flex items-center justify-center bg-slate-900 rounded-lg" style={{ height: "600px" }}>
              <div className="flex flex-col items-center gap-3">
                <Loader className="h-8 w-8 animate-spin text-blue-400" />
                <p className="text-gray-400">Loading live precipitation data...</p>
              </div>
            </div>
          )}

          {/* Iframe */}
          <iframe
            src="https://zoom.earth/maps/precipitation/#view=15.34,79.32,5z/model=icon"
            className="w-full rounded-lg border border-slate-700"
            style={{ height: "600px" }}
            onLoad={() => setIsLoadingMap(false)}
            title="Live Precipitation Map"
          />

          {/* Info Panel */}
          <Card className="mt-4 border-slate-600 bg-slate-700">
            <CardContent className="pt-6">
              <p className="text-xs text-gray-300">
                <strong>Zoom Earth Precipitation:</strong> Real-time satellite data showing current and forecasted
                precipitation patterns across the region. The map displays live weather radar and precipitation
                forecasts updated every few minutes.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
