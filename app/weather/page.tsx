"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Cloud,
  RefreshCw,
  ExternalLink,
  Info,
  AlertTriangle,
  Thermometer,
  Droplets,
  Wind,
  MapPin,
  BarChart,
  Calendar,
  Clock,
  ChevronRight,
  Search,
  Menu,
  X,
  CloudRain,
  CloudSnow,
  Sun,
  CloudLightning,
  Eye,
  BarChart3,
  Zap,
  Waves,
} from "lucide-react"
import { format } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Progress } from "@/components/ui/progress"

// Types for AI weather predictions
interface WeatherPrediction {
  location: string
  region: string
  prediction: string
  confidence: number
  temperature: { min: number; max: number }
  precipitation: number
  humidity: number
  windSpeed: number
  windDirection: string
  alerts: string[]
  model: {
    name: string
    description: string
    specialization: string
    accuracy: number
  }
  updated: string
  forecastDate: string
}

interface ModelInsights {
  primaryModel: {
    name: string
    description: string
    specialization: string
    accuracy: number
  }
  dataPoints: number
  confidenceOverall: number
  lastTrained: string
  keyFactors: string[]
}

interface AIWeatherData {
  currentPredictions: WeatherPrediction[]
  forecast: WeatherPrediction[]
  modelInsights: ModelInsights
  timestamp: string
}

// Enhanced Weather Map Component
const WeatherMap = () => {
  const [mapLoaded, setMapLoaded] = useState(false)
  const [activeLayer, setActiveLayer] = useState("satellite")

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setMapLoaded(true)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Weather map layers
  const mapLayers = [
    { id: "satellite", name: "Satellite", icon: <Eye className="h-4 w-4" /> },
    { id: "radar", name: "Radar", icon: <Waves className="h-4 w-4" /> },
    { id: "temperature", name: "Temperature", icon: <Thermometer className="h-4 w-4" /> },
    { id: "precipitation", name: "Precipitation", icon: <CloudRain className="h-4 w-4" /> },
    { id: "wind", name: "Wind", icon: <Wind className="h-4 w-4" /> },
    { id: "pressure", name: "Pressure", icon: <BarChart3 className="h-4 w-4" /> },
  ]

  return (
    <div className="h-full w-full bg-gradient-to-b from-slate-900 to-slate-950 flex flex-col relative">
      {!mapLoaded ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="relative h-16 w-16 mb-4">
              <div className="absolute inset-0 rounded-full border-t-2 border-b-2 border-cyan-500 animate-spin"></div>
              <div className="absolute inset-2 rounded-full border-r-2 border-l-2 border-blue-500 animate-spin animation-delay-150"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Cloud className="h-6 w-6 text-cyan-400" />
              </div>
            </div>
            <p className="text-cyan-300 font-medium">Loading weather map...</p>
            <p className="text-xs text-gray-400 mt-1">Connecting to live satellite feed...</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 relative overflow-hidden">
          {/* Weather map iframe - Using Windy.com embed */}
          <div className="absolute inset-0 bg-black">
            <iframe 
              src="https://embed.windy.com/embed2.html?lat=12.919&lon=74.860&detailLat=12.919&detailLon=74.860&width=650&height=450&zoom=5&level=surface&overlay=wind&product=ecmwf&menu=&message=&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=default&metricTemp=default&radarRange=-1" 
              className="w-full h-full border-0"
              title="Windy Weather Map"
              allowFullScreen
            />
          </div>

          {/* Map layers selector */}
          <div className="absolute top-4 left-4 z-10 pointer-events-none">
            <div className="bg-slate-800/80 backdrop-blur-sm p-2 rounded-lg shadow-lg pointer-events-auto">
              <h3 className="text-sm font-medium text-white mb-2 px-2">Map Layers</h3>
              <div className="flex flex-col gap-1">
                {mapLayers.map((layer) => (
                  <Button
                    key={layer.id}
                    size="sm"
                    variant={activeLayer === layer.id ? "default" : "outline"}
                    className={`justify-start h-8 ${
                      activeLayer === layer.id
                        ? "bg-gradient-to-r from-cyan-700 to-blue-700 text-white"
                        : "bg-slate-800/60 text-gray-300 hover:text-white hover:bg-slate-700/60"
                    }`}
                    onClick={() => setActiveLayer(layer.id)}
                  >
                    <span className="flex items-center">
                      {layer.icon}
                      <span className="ml-2">{layer.name}</span>
                    </span>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Location search */}
          <div className="absolute top-4 right-4 z-10 pointer-events-none">
            <div className="bg-slate-800/80 backdrop-blur-sm p-2 rounded-lg shadow-lg w-64 pointer-events-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search location..."
                  className="w-full bg-slate-700/80 border border-slate-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 pl-8 text-white"
                />
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                <Badge className="bg-cyan-700/70 hover:bg-cyan-600/70 cursor-pointer">Bangalore</Badge>
                <Badge className="bg-slate-700/70 hover:bg-slate-600/70 cursor-pointer">Mangaluru</Badge>
                <Badge className="bg-slate-700/70 hover:bg-slate-600/70 cursor-pointer">Mysuru</Badge>
              </div>
            </div>
          </div>

          {/* Map controls */}
          <div className="absolute bottom-4 left-4 z-10 pointer-events-none">
            <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg shadow-lg flex flex-col pointer-events-auto">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-slate-700/60">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M5 12h14"></path>
                  <path d="M12 5v14"></path>
                </svg>
              </Button>
              <div className="h-px bg-slate-700"></div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-slate-700/60">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M5 12h14"></path>
                </svg>
              </Button>
            </div>
          </div>

          {/* Map legend */}
          <div className="absolute bottom-4 right-4 z-10 pointer-events-none">
            <div className="bg-slate-800/80 backdrop-blur-sm p-2 rounded-lg shadow-lg pointer-events-auto">
              <h3 className="text-xs font-medium text-white mb-1">Legend</h3>
              <div className="flex items-center gap-1 mb-1">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-xs text-gray-300">Light</span>
              </div>
              <div className="flex items-center gap-1 mb-1">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-xs text-gray-300">Moderate</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-xs text-gray-300">Heavy</span>
              </div>
            </div>
          </div>

          {/* Attribution */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 pointer-events-none">
            <div className="bg-slate-800/80 backdrop-blur-sm p-1.5 rounded text-xs text-gray-300 pointer-events-auto">
              Weather data © Windy.com
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Play icon component
const Play = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
)

// Mock AI weather prediction data
const mockAiData: AIWeatherData = {
  currentPredictions: [
    {
      location: "Mangaluru",
      region: "Dakshina Kannada",
      prediction:
        "Partly cloudy and fair weather today with no rainfall observed. IMD forecasts heavy rain, thunderstorms, and lightning expected from Dec 6–8.",
      confidence: 85,
      temperature: { min: 24, max: 29 }, // 26°C feels like 29°C (show range in UI)
      precipitation: 0, // 0% precip today
      humidity: 83,
      windSpeed: 13,
      windDirection: "N",
      alerts: ["No active warnings for the next 48 hours.", "Forecast: Heavy rain expected from Dec 6–8 (IMD)."],
      model: {
        name: "DeepWeather-CNN",
        description: "Convolutional Neural Network trained on regional data",
        specialization: "Coastal weather patterns",
        accuracy: 92,
      },
      updated: new Date().toISOString(),
      forecastDate: new Date().toISOString(),
    },
    {
      location: "Udupi",
      region: "Udupi District",
      prediction: "Moderate to heavy rainfall with strong winds along the coast. High humidity levels expected.",
      confidence: 89,
      temperature: { min: 23, max: 28 },
      precipitation: 75,
      humidity: 90,
      windSpeed: 20,
      windDirection: "SW",
      alerts: ["Strong wind advisory for coastal areas"],
      model: {
        name: "AtmosLSTM",
        description: "Long Short-Term Memory network for temporal patterns",
        specialization: "Rainfall intensity prediction",
        accuracy: 89,
      },
      updated: new Date().toISOString(),
      forecastDate: new Date().toISOString(),
    },
    {
      location: "Karwar",
      region: "Uttara Kannada",
      prediction: "Heavy rainfall with occasional breaks. Rough sea conditions expected along the coast.",
      confidence: 87,
      temperature: { min: 24, max: 30 },
      precipitation: 80,
      humidity: 88,
      windSpeed: 22,
      windDirection: "SW",
      alerts: ["Rough sea warning for fishermen"],
      model: {
        name: "GeoTransformer",
        description: "Transformer model with geographical features",
        specialization: "Coastal weather events",
        accuracy: 87,
      },
      updated: new Date().toISOString(),
      forecastDate: new Date().toISOString(),
    },
    {
      location: "Bangalore",
      region: "Bangalore Urban",
      prediction: "Partly cloudy with occasional showers. Moderate humidity and mild temperatures.",
      confidence: 90,
      temperature: { min: 21, max: 28 },
      precipitation: 40,
      humidity: 75,
      windSpeed: 12,
      windDirection: "W",
      alerts: [],
      model: {
        name: "AtmosLSTM",
        description: "Long Short-Term Memory network for temporal patterns",
        specialization: "Urban weather patterns",
        accuracy: 90,
      },
      updated: new Date().toISOString(),
      forecastDate: new Date().toISOString(),
    },
    {
      location: "Mysuru",
      region: "Mysuru District",
      prediction: "Mild temperatures with light rainfall. Increasing cloud cover expected.",
      confidence: 88,
      temperature: { min: 22, max: 29 },
      precipitation: 30,
      humidity: 70,
      windSpeed: 10,
      windDirection: "W",
      alerts: [],
      model: {
        name: "GeoTransformer",
        description: "Transformer model with geographical features",
        specialization: "Regional weather patterns",
        accuracy: 88,
      },
      updated: new Date().toISOString(),
      forecastDate: new Date().toISOString(),
    },
  ],
  forecast: [
    {
      location: "Mangaluru",
      region: "Dakshina Kannada",
      prediction: "Partly cloudy",
      confidence: 85,
      temperature: { min: 24, max: 29 },
      precipitation: 15,
      humidity: 83,
      windSpeed: 13,
      windDirection: "N",
      alerts: [],
      model: {
        name: "EnsembleClimate",
        description: "Ensemble model for forecasting",
        specialization: "Overall prediction",
        accuracy: 92,
      },
      forecastDate: new Date("2025-12-05T00:00:00.000Z").toISOString(),
      updated: new Date().toISOString(),
    },
    {
      location: "Mangaluru",
      region: "Dakshina Kannada",
      prediction: "Cloudy",
      confidence: 82,
      temperature: { min: 24, max: 29 },
      precipitation: 20,
      humidity: 84,
      windSpeed: 12,
      windDirection: "N",
      alerts: [],
      model: {
        name: "EnsembleClimate",
        description: "Ensemble model for forecasting",
        specialization: "Overall prediction",
        accuracy: 88,
      },
      forecastDate: new Date("2025-12-06T00:00:00.000Z").toISOString(),
      updated: new Date().toISOString(),
    },
    {
      location: "Mangaluru",
      region: "Dakshina Kannada",
      prediction: "Scattered thunderstorms",
      confidence: 78,
      temperature: { min: 24, max: 29 },
      precipitation: 45,
      humidity: 88,
      windSpeed: 16,
      windDirection: "SW",
      alerts: [],
      model: {
        name: "EnsembleClimate",
        description: "Ensemble model for forecasting",
        specialization: "Overall prediction",
        accuracy: 84,
      },
      forecastDate: new Date("2025-12-07T00:00:00.000Z").toISOString(),
      updated: new Date().toISOString(),
    },
    {
      location: "Mangaluru",
      region: "Dakshina Kannada",
      prediction: "Light rain",
      confidence: 76,
      temperature: { min: 24, max: 29 },
      precipitation: 20,
      humidity: 86,
      windSpeed: 14,
      windDirection: "SW",
      alerts: [],
      model: {
        name: "EnsembleClimate",
        description: "Ensemble model for forecasting",
        specialization: "Overall prediction",
        accuracy: 80,
      },
      forecastDate: new Date("2025-12-08T00:00:00.000Z").toISOString(),
      updated: new Date().toISOString(),
    },
    {
      location: "Mangaluru",
      region: "Dakshina Kannada",
      prediction: "Light rain",
      confidence: 74,
      temperature: { min: 24, max: 28 },
      precipitation: 25,
      humidity: 84,
      windSpeed: 12,
      windDirection: "SW",
      alerts: [],
      model: {
        name: "EnsembleClimate",
        description: "Ensemble model for forecasting",
        specialization: "Overall prediction",
        accuracy: 78,
      },
      forecastDate: new Date("2025-12-09T00:00:00.000Z").toISOString(),
      updated: new Date().toISOString(),
    },
  ],
  modelInsights: {
    primaryModel: {
      name: "KarnatakaWeatherNet",
      description: "Specialized ensemble model for Karnataka coastal regions",
      specialization: "Monsoon patterns and coastal weather",
      accuracy: 91,
    },
    dataPoints: 1250000,
    confidenceOverall: 91,
    lastTrained: new Date(Date.now() - 7 * 86400000).toISOString(), // 1 week ago
    keyFactors: [
      "Western Ghats orographic effect",
      "Arabian Sea moisture transport",
      "Coastal convergence zones",
      "Monsoon low-pressure systems",
      "Sea surface temperature anomalies",
      "Upper-level wind patterns",
      "Historical precipitation patterns",
      "Local topographical features",
    ],
  },
  timestamp: new Date().toISOString(),
}

// AI model types we're "using"
const aiModels = [
  {
    name: "DeepWeather-CNN",
    description: "Convolutional Neural Network trained on 50 years of meteorological data",
    specialization: "Precipitation patterns and intensity",
  },
  {
    name: "AtmosLSTM",
    description: "Long Short-Term Memory network for temporal weather pattern analysis",
    specialization: "Temperature and humidity forecasting",
  },
  {
    name: "GeoTransformer",
    description: "Transformer-based model incorporating geographical and topographical features",
    specialization: "Region-specific weather events",
  },
  {
    name: "EnsembleClimate",
    description: "Ensemble model combining multiple prediction algorithms",
    specialization: "Overall weather pattern prediction",
  },
]

// Brain icon component
const Brain = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
  </svg>
)

export default function WeatherPage() {
  const [currentTime, setCurrentTime] = useState(new Date("2025-12-04T10:23:00")) // Initialize with specific date
  const [showInfo, setShowInfo] = useState(false)
  const [activeTab, setActiveTab] = useState("map")
  const [selectedLocation, setSelectedLocation] = useState("Mangaluru")
  const [aiData, setAiData] = useState<AIWeatherData | null>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState<string | null>(null)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date()) // This will eventually catch up to real time if left running, but for demo purposes, the initial state is Dec 4
    }, 60000)

    return () => {
      clearInterval(timer)
    }
  }, [])

  // Fetch AI weather predictions (simulated)
  const fetchAiPredictions = async () => {
    try {
      setAiLoading(true)
      setAiError(null)

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Use mock data instead of actual API call
      setAiData(mockAiData)
    } catch (error) {
      console.error("Error fetching AI predictions:", error)
      setAiError(error instanceof Error ? error.message : "Unknown error occurred")
    } finally {
      setAiLoading(false)
    }
  }

  // Fetch AI predictions when tab changes to AI or on initial load
  useEffect(() => {
    if (activeTab === "ai" && !aiData && !aiLoading) {
      fetchAiPredictions()
    }
  }, [activeTab, aiData, aiLoading])

  // Get the selected location's prediction
  const getSelectedPrediction = () => {
    if (!aiData) return null
    return aiData.currentPredictions.find((p) => p.location === selectedLocation) || aiData.currentPredictions[0]
  }

  const selectedPrediction = getSelectedPrediction()

  // Get weather icon based on prediction
  const getWeatherIcon = (prediction: string, precipitation: number) => {
    if (prediction.toLowerCase().includes("thunderstorm")) {
      return <CloudLightning className="h-8 w-8 text-yellow-400" />
    } else if (prediction.toLowerCase().includes("snow")) {
      return <CloudSnow className="h-8 w-8 text-blue-200" />
    } else if (precipitation > 70) {
      return <CloudRain className="h-8 w-8 text-blue-400" />
    } else if (precipitation > 30) {
      return <Cloud className="h-8 w-8 text-gray-400" />
    } else {
      return <Sun className="h-8 w-8 text-yellow-400" />
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-blue-900 to-indigo-900 p-4 flex justify-between items-center shadow-lg"
      >
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-white hover:bg-blue-800/50 rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Cloud className="h-6 w-6 text-blue-300" />
            <h1 className="text-xl font-bold">Weather Intelligence</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-xs text-blue-200">{format(currentTime, "EEEE, MMM d")}</div>
            {/* Updated timestamp to current time */}
            <div className="text-sm font-medium">{format(currentTime, "h:mm a")}</div>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-blue-800/50 rounded-full"
                  onClick={() => setShowInfo(!showInfo)}
                >
                  <Info className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Weather Information</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-blue-800/50 rounded-full"
                  onClick={() => {
                    if (activeTab === "ai") {
                      fetchAiPredictions()
                    } else {
                      window.location.reload()
                    }
                  }}
                >
                  <RefreshCw className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Refresh Data</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-blue-800/50 rounded-full md:hidden"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-slate-800 border-b border-slate-700"
          >
            <div className="p-3 space-y-2">
              <Button
                variant={activeTab === "map" ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => {
                  setActiveTab("map")
                  setShowMobileMenu(false)
                }}
              >
                <MapPin className="h-4 w-4 mr-2" />
                Weather Map
              </Button>
              <Button
                variant={activeTab === "ai" ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => {
                  setActiveTab("ai")
                  setShowMobileMenu(false)
                }}
              >
                <Brain className="h-4 w-4 mr-2" />
                AI Weather Predictions
              </Button>
              <Select
                value={selectedLocation}
                onValueChange={(value) => {
                  setSelectedLocation(value)
                  setShowMobileMenu(false)
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {mockAiData.currentPredictions.map((prediction) => (
                    <SelectItem key={prediction.location} value={prediction.location}>
                      {prediction.location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                className="w-full justify-start bg-blue-700 hover:bg-blue-600"
                onClick={() => window.open("https://www.windy.com/?12.919,74.860,5", "_blank")}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Windy.com
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative">
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <div className="bg-slate-800 border-b border-slate-700 hidden md:block">
            <TabsList className="grid grid-cols-2 w-full max-w-6xl mx-auto bg-slate-700/30 p-1">
              <TabsTrigger
                value="map"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-700 data-[state=active]:to-indigo-700"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Weather Map
              </TabsTrigger>
              <TabsTrigger
                value="ai"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-700 data-[state=active]:to-indigo-700"
              >
                <Brain className="h-4 w-4 mr-2" />
                AI Weather Predictions
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="map" className="flex-1 h-full m-0 p-0 data-[state=active]:h-full">
            <div className="relative h-full w-full">
              {/* Weather Map Component */}
              <WeatherMap />

              {/* Windy.com link */}
              <div className="absolute top-4 right-4 z-20">
                <Button
                  className="bg-blue-700 hover:bg-blue-600"
                  onClick={() =>
                    window.open("https://www.windy.com/?12.919,74.860,5", "_blank")
                  }
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Windy.com
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ai" className="flex-1 h-full m-0 overflow-auto">
            <div className="p-4 md:p-6 max-w-6xl mx-auto">
              {aiLoading ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-center py-12">
                    <div className="flex flex-col items-center">
                      <div className="relative h-16 w-16 mb-4">
                        <div className="absolute inset-0 rounded-full border-t-2 border-b-2 border-blue-500 animate-spin"></div>
                        <div className="absolute inset-2 rounded-full border-r-2 border-l-2 border-indigo-500 animate-spin animation-delay-150"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Brain className="h-6 w-6 text-blue-400" />
                        </div>
                      </div>
                      <p className="text-blue-300 font-medium text-lg">Processing AI Weather Models</p>
                      <p className="text-sm text-gray-400 mt-1">Analyzing meteorological data for Karnataka region</p>

                      <div className="w-64 mt-6">
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>Data Collection</span>
                          <span>Processing</span>
                          <span>Analysis</span>
                        </div>
                        <Progress value={65} className="h-1.5" />
                      </div>
                    </div>
                  </div>
                  <Card className="bg-slate-800/60 border-slate-700/50">
                    <CardHeader>
                      <Skeleton className="h-8 w-3/4 bg-slate-700" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Skeleton className="h-4 w-full bg-slate-700" />
                      <Skeleton className="h-4 w-5/6 bg-slate-700" />
                      <Skeleton className="h-4 w-4/6 bg-slate-700" />
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Skeleton className="h-20 bg-slate-700" />
                        <Skeleton className="h-20 bg-slate-700" />
                        <Skeleton className="h-20 bg-slate-700" />
                        <Skeleton className="h-20 bg-slate-700" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : aiError ? (
                <Card className="bg-red-900/20 border-red-800/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-300">
                      <AlertTriangle className="h-5 w-5" />
                      Error Loading AI Predictions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">{aiError}</p>
                    <Button className="mt-4 bg-red-800 hover:bg-red-700" onClick={fetchAiPredictions}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Retry
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8"
                  >
                    {/* Weather Intelligence Update block */}
                    <div className="mb-8">
                      <div className="bg-slate-800/60 border border-slate-700/50 rounded-lg p-4 md:p-6">
                        <h3 className="text-xl font-bold mb-2 text-blue-300">
                          Mangaluru Weather Report Updated as of December 4, 2025
                        </h3>
                        <p className="text-gray-200">
                          {
                            "The heavy monsoon downpours have subsided in Mangaluru, giving way to partly cloudy skies. The previous Orange Alert for heavy rainfall has been lifted, with no immediate warnings in effect for the coastal Karnataka region. However, residents are advised to stay updated as forecasts predict the return of heavy rain later in the week."
                          }
                        </p>

                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                          <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                            <h4 className="font-semibold text-white mb-2">Current Conditions</h4>
                            <ul className="text-sm text-gray-300 space-y-1">
                              <li>
                                <span className="text-gray-400">Weather:</span> Partly Cloudy
                              </li>
                              <li>
                                <span className="text-gray-400">Temperature:</span> 26°C (Feels like 29°C)
                              </li>
                              <li>
                                <span className="text-gray-400">Precipitation:</span> 0%
                              </li>
                              <li>
                                <span className="text-gray-400">Humidity:</span> 83%
                              </li>
                              <li>
                                <span className="text-gray-400">Wind:</span> 13 km/h from the North
                              </li>
                            </ul>
                          </div>
                          <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                            <h4 className="font-semibold text-white mb-2">Weather Alerts</h4>
                            <p className="text-sm text-gray-300">
                              {
                                "There are no active weather warnings for Mangaluru for the next 48 hours. However, the India Meteorological Department (IMD) has issued a forecast for heavy rain, thunderstorms, and lightning expected to commence from December 6th through December 8th."
                              }
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                          <h4 className="font-semibold text-white mb-2">AI Model Details</h4>
                          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4 text-sm text-gray-300">
                            <div>
                              <span className="text-gray-400">Model:</span> DeepWeather-CNN
                            </div>
                            <div>
                              <span className="text-gray-400">Type:</span> Convolutional Neural Network
                            </div>
                            <div>
                              <span className="text-gray-400">Specialization:</span> Coastal weather patterns
                            </div>
                            <div>
                              <span className="text-gray-400">Accuracy:</span> 92%
                            </div>
                            <div>
                              <span className="text-gray-400">Confidence:</span> 85%
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            {
                              "This prediction is based on machine learning models trained on historical weather data specific to the Karnataka region."
                            }
                          </p>
                        </div>

                        <div className="mt-4">
                          <h4 className="font-semibold text-white mb-2">5-Day Forecast</h4>
                          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                            <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
                              <div className="text-sm font-medium text-white">Friday</div>
                              <div className="text-xs text-gray-400">Dec 5</div>
                              <div className="mt-2 text-gray-200">24° - 29°C</div>
                              <div className="text-sm text-gray-400">Partly cloudy</div>
                              <div className="text-xs text-gray-500 mt-1">Precip: 15%</div>
                              <div className="text-xs text-gray-500 mt-0.5">Confidence: 85%</div>
                            </div>
                            <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
                              <div className="text-sm font-medium text-white">Saturday</div>
                              <div className="text-xs text-gray-400">Dec 6</div>
                              <div className="mt-2 text-gray-200">24° - 29°C</div>
                              <div className="text-sm text-gray-400">Cloudy</div>
                              <div className="text-xs text-gray-500 mt-1">Precip: 20%</div>
                              <div className="text-xs text-gray-500 mt-0.5">Confidence: 82%</div>
                            </div>
                            <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
                              <div className="text-sm font-medium text-white">Sunday</div>
                              <div className="text-xs text-gray-400">Dec 7</div>
                              <div className="mt-2 text-gray-200">24° - 29°C</div>
                              <div className="text-sm text-gray-400">Scattered thunderstorms</div>
                              <div className="text-xs text-gray-500 mt-1">Precip: 45%</div>
                              <div className="text-xs text-gray-500 mt-0.5">Confidence: 78%</div>
                            </div>
                            <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
                              <div className="text-sm font-medium text-white">Monday</div>
                              <div className="text-xs text-gray-400">Dec 8</div>
                              <div className="mt-2 text-gray-200">24° - 29°C</div>
                              <div className="text-sm text-gray-400">Light rain</div>
                              <div className="text-xs text-gray-500 mt-1">Precip: 20%</div>
                              <div className="text-xs text-gray-500 mt-0.5">Confidence: 76%</div>
                            </div>
                            <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
                              <div className="text-sm font-medium text-white">Tuesday</div>
                              <div className="text-xs text-gray-400">Dec 9</div>
                              <div className="mt-2 text-gray-200">24° - 28°C</div>
                              <div className="text-sm text-gray-400">Light rain</div>
                              <div className="text-xs text-gray-500 mt-1">Precip: 25%</div>
                              <div className="text-xs text-gray-500 mt-0.5">Confidence: 74%</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* End of Weather Intelligence Update block */}

                    <div className="flex flex-col md:flex-row gap-4 md:items-center mb-6">
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                          AI-Powered Weather Intelligence
                        </h2>
                        <p className="text-gray-300 mt-1">
                          Advanced predictions using machine learning models trained on regional data
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                          <SelectTrigger className="w-[180px] bg-slate-800 border-slate-700">
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockAiData.currentPredictions.map((prediction) => (
                              <SelectItem key={prediction.location} value={prediction.location}>
                                {prediction.location}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          variant="outline"
                          className="border-slate-700 hover:bg-slate-800 bg-transparent"
                          onClick={fetchAiPredictions}
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Refresh
                        </Button>
                      </div>
                    </div>

                    <Card className="bg-gradient-to-r from-blue-900/40 to-indigo-900/30 border-blue-800/30 overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-1">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                          style={{ width: `${selectedPrediction?.confidence || 0}%` }}
                        ></div>
                      </div>
                      <CardHeader className="pb-2">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                          <div>
                            <CardTitle className="text-2xl font-bold flex items-center gap-2">
                              {selectedPrediction?.location}
                              <Badge className="ml-2 bg-blue-700/70">
                                {selectedPrediction?.confidence}% confidence
                              </Badge>
                            </CardTitle>
                            <CardDescription className="text-gray-300">
                              {selectedPrediction?.region}, Karnataka
                            </CardDescription>
                          </div>
                          <div className="flex items-center text-sm text-gray-400">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>
                              Updated: {selectedPrediction && format(new Date(selectedPrediction.updated), "h:mm a")}
                            </span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {selectedPrediction && (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="col-span-1 md:col-span-2">
                              <div className="flex items-start gap-4 bg-slate-800/60 p-4 rounded-lg border border-slate-700/50 mb-4">
                                <div className="mt-1">
                                  {getWeatherIcon(selectedPrediction.prediction, selectedPrediction.precipitation)}
                                </div>
                                <div>
                                  <h3 className="text-xl font-semibold text-white mb-1">Current Conditions</h3>
                                  <p className="text-gray-200">{selectedPrediction.prediction}</p>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                                <Card className="bg-slate-800/60 border-slate-700/50">
                                  <CardContent className="p-3 flex flex-col items-center">
                                    <Thermometer className="h-5 w-5 text-red-400 mb-1" />
                                    <div className="text-sm text-gray-400">Temperature</div>
                                    <div className="font-medium text-lg">
                                      {selectedPrediction.temperature.min}° - {selectedPrediction.temperature.max}°C
                                    </div>
                                  </CardContent>
                                </Card>
                                <Card className="bg-slate-800/60 border-slate-700/50">
                                  <CardContent className="p-3 flex flex-col items-center">
                                    <CloudRain className="h-5 w-5 text-blue-400 mb-1" />
                                    <div className="text-sm text-gray-400">Precipitation</div>
                                    <div className="font-medium text-lg">{selectedPrediction.precipitation}%</div>
                                  </CardContent>
                                </Card>
                                <Card className="bg-slate-800/60 border-slate-700/50">
                                  <CardContent className="p-3 flex flex-col items-center">
                                    <Droplets className="h-5 w-5 text-cyan-400 mb-1" />
                                    <div className="text-sm text-gray-400">Humidity</div>
                                    <div className="font-medium text-lg">{selectedPrediction.humidity}%</div>
                                  </CardContent>
                                </Card>
                                <Card className="bg-slate-800/60 border-slate-700/50">
                                  <CardContent className="p-3 flex flex-col items-center">
                                    <Wind className="h-5 w-5 text-indigo-400 mb-1" />
                                    <div className="text-sm text-gray-400">Wind</div>
                                    <div className="font-medium text-lg">
                                      {selectedPrediction.windSpeed} km/h {selectedPrediction.windDirection}
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>

                              {selectedPrediction.alerts.length > 0 && (
                                <div className="mb-4">
                                  <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                                    <AlertTriangle className="h-4 w-4 text-amber-400" />
                                    Weather Alerts
                                  </h3>
                                  <div className="space-y-2">
                                    {selectedPrediction.alerts.map((alert, index) => (
                                      <div
                                        key={index}
                                        className="bg-amber-900/20 border border-amber-900/30 rounded-lg p-3 text-sm"
                                      >
                                        <div className="flex items-start gap-2">
                                          <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                                          <div className="text-slate-300">{alert}</div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>

                            <div>
                              <Card className="bg-slate-800/60 border-slate-700/50 h-full">
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-sm flex items-center gap-2">
                                    <BarChart className="h-4 w-4 text-blue-400" />
                                    AI Model Details
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="text-sm">
                                  <div className="space-y-3">
                                    <div>
                                      <div className="font-medium mb-1 text-white">{selectedPrediction.model.name}</div>
                                      <p className="text-xs text-gray-400">{selectedPrediction.model.description}</p>
                                    </div>
                                    <div className="space-y-1">
                                      <div className="flex justify-between">
                                        <span className="text-gray-400">Specialization:</span>
                                        <span className="text-blue-300">{selectedPrediction.model.specialization}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-400">Accuracy:</span>
                                        <span className="text-blue-300">{selectedPrediction.model.accuracy}%</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-400">Confidence:</span>
                                        <span className="text-blue-300">{selectedPrediction.confidence}%</span>
                                      </div>
                                    </div>
                                    <div className="pt-2 border-t border-slate-700/50">
                                      <div className="text-xs text-gray-500">
                                        This prediction is based on machine learning models trained on historical
                                        weather data specific to the Karnataka region.
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>

                  {aiData?.forecast && aiData.forecast.length > 0 && (
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="mb-8"
                    >
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-blue-400" />
                        5-Day Forecast
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                        {aiData.forecast.map((day, index) => (
                          <motion.div
                            key={index}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 + index * 0.1 }}
                          >
                            <Card className="bg-slate-800/60 border-slate-700/50 hover:border-blue-700/50 transition-colors">
                              <CardHeader className="pb-2 pt-3">
                                <CardTitle className="text-center text-sm">
                                  {format(new Date(day.forecastDate), "EEEE")}
                                  <div className="text-xs font-normal text-gray-400">
                                    {format(new Date(day.forecastDate), "MMM d")}
                                  </div>
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="text-center pb-3">
                                <div className="my-2">{getWeatherIcon(day.prediction, day.precipitation)}</div>
                                <div className="text-lg font-semibold">
                                  {day.temperature.min}° - {day.temperature.max}°C
                                </div>
                                <div className="text-sm text-gray-400 mt-1 line-clamp-1" title={day.prediction}>
                                  {day.prediction}
                                </div>
                                <div className="mt-2 text-xs text-gray-500">
                                  <div className="flex justify-between">
                                    <span>Precip:</span>
                                    <span>{day.precipitation}%</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Confidence:</span>
                                    <span>{day.confidence}%</span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mb-6"
                  >
                    <Drawer>
                      <DrawerTrigger asChild>
                        <Button variant="outline" className="w-full border-slate-700 hover:bg-slate-800 bg-transparent">
                          <Brain className="h-4 w-4 mr-2 text-blue-400" />
                          View AI Model Insights
                        </Button>
                      </DrawerTrigger>
                      <DrawerContent className="bg-slate-900 border-slate-700 text-white">
                        <div className="mx-auto w-full max-w-4xl">
                          <DrawerHeader>
                            <DrawerTitle className="text-xl font-bold flex items-center gap-2">
                              <Brain className="h-5 w-5 text-blue-400" />
                              AI Weather Model Insights
                            </DrawerTitle>
                            <DrawerDescription className="text-gray-400">
                              Technical details about our AI weather prediction system
                            </DrawerDescription>
                          </DrawerHeader>
                          <div className="p-4 pb-8">
                            {aiData?.modelInsights && (
                              <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <Card className="bg-slate-800/60 border-slate-700/50">
                                    <CardContent className="p-4 flex flex-col items-center">
                                      <div className="h-12 w-12 rounded-full bg-blue-900/50 flex items-center justify-center mb-2">
                                        <Brain className="h-6 w-6 text-blue-400" />
                                      </div>
                                      <div className="text-sm text-gray-400">Primary Model</div>
                                      <div className="font-medium text-center">
                                        {aiData.modelInsights.primaryModel.name}
                                      </div>
                                      <div className="text-xs text-gray-500 text-center mt-1">
                                        {aiData.modelInsights.primaryModel.description}
                                      </div>
                                    </CardContent>
                                  </Card>
                                  <Card className="bg-slate-800/60 border-slate-700/50">
                                    <CardContent className="p-4 flex flex-col items-center">
                                      <div className="h-12 w-12 rounded-full bg-blue-900/50 flex items-center justify-center mb-2">
                                        <BarChart3 className="h-6 w-6 text-blue-400" />
                                      </div>
                                      <div className="text-sm text-gray-400">Data Points Analyzed</div>
                                      <div className="font-medium">
                                        {aiData.modelInsights.dataPoints.toLocaleString()}
                                      </div>
                                      <div className="text-xs text-gray-500 mt-1">Historical weather records</div>
                                    </CardContent>
                                  </Card>
                                  <Card className="bg-slate-800/60 border-slate-700/50">
                                    <CardContent className="p-4 flex flex-col items-center">
                                      <div className="h-12 w-12 rounded-full bg-blue-900/50 flex items-center justify-center mb-2">
                                        <Zap className="h-6 w-6 text-blue-400" />
                                      </div>
                                      <div className="text-sm text-gray-400">Overall Confidence</div>
                                      <div className="font-medium">{aiData.modelInsights.confidenceOverall}%</div>
                                      <div className="text-xs text-gray-500 mt-1">
                                        Last trained:{" "}
                                        {format(new Date(aiData.modelInsights.lastTrained), "MMM d, yyyy")}
                                      </div>
                                    </CardContent>
                                  </Card>
                                </div>

                                <div>
                                  <h4 className="text-sm font-medium mb-3">Key Factors Analyzed</h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                                    {aiData.modelInsights.keyFactors.map((factor, index) => (
                                      <div
                                        key={index}
                                        className="flex items-center gap-2 bg-slate-800/40 p-2 rounded-md border border-slate-700/50"
                                      >
                                        <ChevronRight className="h-4 w-4 text-blue-500 shrink-0" />
                                        <span className="text-sm">{factor}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <div>
                                  <h4 className="text-sm font-medium mb-3">AI Models in Ensemble</h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {aiModels.map((model, index) => (
                                      <Card key={index} className="bg-slate-800/40 border-slate-700/50">
                                        <CardContent className="p-3">
                                          <div className="font-medium mb-1 flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                            {model.name}
                                          </div>
                                          <div className="text-xs text-gray-400 mb-2">{model.description}</div>
                                          <div className="flex justify-between text-xs">
                                            <span className="text-gray-500">Specialization:</span>
                                            <span className="text-blue-300">{model.specialization}</span>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    ))}
                                  </div>
                                </div>

                                <div className="bg-slate-800/40 p-4 rounded-lg border border-slate-700/50">
                                  <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                                    <Info className="h-4 w-4 text-blue-400" />
                                    About Our AI Weather System
                                  </h4>
                                  <p className="text-sm text-gray-300">
                                    Our AI weather prediction system uses multiple specialized models trained on
                                    regional data from Karnataka and the Western Ghats. The system analyzes
                                    topographical features, historical patterns, and real-time satellite data to
                                    generate accurate forecasts.
                                  </p>
                                  <p className="text-xs text-gray-500 mt-2">
                                    AI predictions are based on machine learning models and should be used as guidance
                                    only. Always follow official weather advisories from the Indian Meteorological
                                    Department.
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </DrawerContent>
                    </Drawer>
                  </motion.div>
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Info panel */}
        {showInfo && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute bottom-0 left-0 right-0 bg-slate-800/90 backdrop-blur-md p-4 border-t border-slate-700 z-10"
          >
            <h3 className="text-lg font-bold mb-2 text-blue-300">About Weather Intelligence</h3>
            <p className="text-sm text-gray-300">
              This advanced weather platform combines satellite imagery from AccuWeather with our proprietary AI
              prediction models. The system analyzes historical weather patterns, topographical features, and real-time
              data to provide accurate forecasts specifically tailored for the Karnataka region of India.
            </p>
            <div className="mt-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <span className="text-xs text-gray-400">
                Satellite imagery provided by Windy.com • AI predictions powered by our custom ML models
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-slate-700 hover:bg-slate-800 bg-transparent"
                  onClick={() => setShowInfo(false)}
                >
                  <X className="h-4 w-4 mr-1" />
                  Close
                </Button>
                <Button
                  size="sm"
                  className="bg-blue-700 hover:bg-blue-600"
                  onClick={() =>
                    window.open("https://www.windy.com/?12.919,74.860,5", "_blank")
                  }
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Visit Windy.com
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  )
}
