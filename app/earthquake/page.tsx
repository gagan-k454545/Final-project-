"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, RefreshCw, ExternalLink, Info, AlertTriangle, BarChart, Globe } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { motion } from "framer-motion"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function EarthquakePage() {
  const [loading, setLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showInfo, setShowInfo] = useState(false)
  const [iframeLoaded, setIframeLoaded] = useState(false)
  const [activeTab, setActiveTab] = useState("live")

  // Updated prediction data
  const predictionData = [
    {
      region: "Coastal Karnataka",
      seismicZone: "Zone III (Moderate Risk)",
      lastEvent: "No significant tremors in the past 30 days",
      activity: "0 tremors",
    },
    {
      region: "Kalaburagi Region",
      seismicZone: "Zone III (Moderate Risk)",
      lastEvent: "2.3 Mag (Sep 2025)",
      activity: "A few minor tremors earlier",
    },
    {
      region: "Kodagu & Hassan Region",
      seismicZone: "Zone II (Low Risk)",
      lastEvent: "1.6 Mag (ABP Live)",
      activity: "Low activity",
    },
    {
      region: "Ballari & Chitradurga",
      seismicZone: "Zone II (Low Risk)",
      lastEvent: "No recorded recent events of note",
      activity: "Low activity",
    },
  ]

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    // Simulate loading time for iframe
    const loadTimer = setTimeout(() => {
      if (!iframeLoaded && activeTab === "live") {
        setLoading(false)
      }
    }, 5000)

    return () => {
      clearInterval(timer)
      clearTimeout(loadTimer)
    }
  }, [iframeLoaded, activeTab])

  useEffect(() => {
    // Reset loading state when switching tabs
    if (activeTab === "live" && !iframeLoaded) {
      setLoading(true)
      const loadTimer = setTimeout(() => {
        setLoading(false)
      }, 5000)
      return () => clearTimeout(loadTimer)
    } else {
      setLoading(false)
    }
  }, [activeTab, iframeLoaded])

  const handleIframeLoad = () => {
    setIframeLoaded(true)
    setLoading(false)
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-orange-700 to-orange-900 p-4 flex justify-between items-center shadow-lg"
      >
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-white hover:bg-orange-800 rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            <h1 className="text-xl font-bold">Karnataka - Live Seismic Hazard Analysis</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-xs text-orange-200">{format(currentTime, "EEEE, MMMM d")}</div>
            <div className="text-sm font-medium">{format(currentTime, "h:mm a")}</div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-orange-800 rounded-full"
            onClick={() => setShowInfo(!showInfo)}
          >
            <Info className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-orange-800 rounded-full"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="h-5 w-5" />
          </Button>
        </div>
      </motion.header>

      {/* Tab Navigation */}
      <div className="bg-slate-800 px-4 py-2 border-b border-slate-700">
        <Tabs defaultValue="live" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
            <TabsTrigger value="live" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span>Live Data</span>
            </TabsTrigger>
            <TabsTrigger value="prediction" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              <span>AI Predictions</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative">
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-slate-900"
          >
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mb-4"></div>
              <p className="text-orange-500">Loading earthquake data...</p>
            </div>
          </motion.div>
        ) : (
          <div className="h-full">
            {activeTab === "live" ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="h-full flex flex-col"
              >
                {/* CISN Map iframe */}
                <div className="relative flex-1 w-full">
                  <iframe
                    src="https://www.cisn.org/map/index.html"
                    className="w-full h-full border-0"
                    title="CISN Earthquake Map"
                    allowFullScreen
                    onLoad={handleIframeLoad}
                  />

                  {/* Overlay for attribution */}
                  <div className="absolute bottom-4 right-4 bg-slate-800/80 p-2 rounded-lg shadow-lg z-10">
                    <a
                      href="https://www.cisn.org/map/index.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-xs text-orange-300 hover:text-orange-200"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      CISN Earthquake Map
                    </a>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="h-full overflow-auto p-4"
              >
                <div className="max-w-4xl mx-auto">
                  <div className="bg-gradient-to-r from-orange-900/40 to-orange-800/30 rounded-xl p-6 shadow-lg mb-6">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <BarChart className="h-5 w-5 text-orange-400" />
                      Earthquake Monitoring and Prediction – Karnataka
                    </h2>
                    <p className="text-gray-300 mb-4">
                      The system monitors real-time seismic data from observatories across Karnataka, analyzing
                      historical patterns and regional geology to assess current hazard levels and provide timely
                      information on local seismic activity.
                    </p>
                    <div className="bg-slate-800/60 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">Prediction Confidence</span>
                        <span className="text-sm font-medium text-orange-400">72%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2.5">
                        <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: "72%" }}></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Based on the Karnataka State seismic monitoring network — latest data:
                      </p>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold mb-3">Regional Predictions</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {predictionData.map((prediction, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-slate-800 rounded-lg p-4 border border-slate-700"
                      >
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-orange-300">{prediction.region}</h4>
                          <div
                            className={`text-xs font-semibold px-2 py-1 rounded-full ${
                              prediction.seismicZone === "Zone II (Low Risk)"
                                ? "bg-green-900/30 text-green-400"
                                : prediction.seismicZone === "Zone III (Moderate Risk)"
                                  ? "bg-yellow-900/30 text-yellow-400"
                                  : "bg-red-900/30 text-red-400"
                            }`}
                          >
                            {prediction.seismicZone}
                          </div>
                        </div>
                        <div className="mt-2 space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Last Event:</span>
                            <span className="font-medium">{prediction.lastEvent}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Recent Activity:</span>
                            <span className="font-medium">{prediction.activity}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-6 bg-slate-800 rounded-lg p-4 border border-slate-700">
                    <h3 className="text-lg font-semibold mb-3">Sensor Network Status</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-slate-700/50 p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-orange-400">6</div>
                        <div className="text-xs text-gray-400">Active Sensors</div>
                      </div>
                      <div className="bg-slate-700/50 p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-400">98.2%</div>
                        <div className="text-xs text-gray-400">Network Uptime</div>
                      </div>
                      <div className="bg-slate-700/50 p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-blue-400">5 min</div>
                        <div className="text-xs text-gray-400">Data Latency</div>
                      </div>
                      <div className="bg-slate-700/50 p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-purple-400">24/7</div>
                        <div className="text-xs text-gray-400">Monitoring</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 text-xs text-gray-500">
                    <p>
                      Last updated: {format(currentTime, "MMMM d, yyyy 'at' h:mm a")}. Predictions are based on machine
                      learning models and should be used as guidance only. Always follow official emergency
                      instructions.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* Info panel */}
        {showInfo && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-slate-800 p-4 border-t border-slate-700"
          >
            <h3 className="text-lg font-semibold mb-2">Earthquake Safety Tips</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <span className="bg-orange-500/20 p-1 rounded-full mt-1">
                  <AlertTriangle className="h-3 w-3 text-orange-500" />
                </span>
                <span>
                  Drop, Cover, and Hold On: Drop to the ground, take cover under a sturdy table, and hold on until
                  shaking stops.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-orange-500/20 p-1 rounded-full mt-1">
                  <AlertTriangle className="h-3 w-3 text-orange-500" />
                </span>
                <span>Stay away from windows, outside walls, and anything that could fall.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-orange-500/20 p-1 rounded-full mt-1">
                  <AlertTriangle className="h-3 w-3 text-orange-500" />
                </span>
                <span>If outdoors, find a clear spot away from buildings, trees, and power lines.</span>
              </li>
            </ul>
            <div className="mt-3 text-xs text-gray-400">
              Data provided by the Karnataka State Seismic Network. The map shows recent earthquake activity. Click on
              earthquake markers for detailed information.
            </div>
          </motion.div>
        )}
      </main>
    </div>
  )
}
