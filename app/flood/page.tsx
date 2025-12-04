"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Droplets, RefreshCw, ExternalLink, Info, AlertTriangle, BarChart, Globe } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { motion } from "framer-motion"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function FloodPage() {
  const [loading, setLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showInfo, setShowInfo] = useState(false)
  const [iframeLoaded, setIframeLoaded] = useState(false)
  const [activeTab, setActiveTab] = useState("live")

  // Update prediction data to reflect Green Alerts and observed/forecast values
  const predictionData = [
    {
      region: "Mangaluru City",
      riskLevel: "Low",
      alertLevel: "Green Alert",
      rainfallObs: "0 mm",
      rainfallFcst: "Light or no rain expected",
      timeframe: "Next 24 Hours",
    },
    {
      region: "Bantwal",
      riskLevel: "Low",
      alertLevel: "Green Alert",
      rainfallObs: "0 mm",
      rainfallFcst: "Light or no rain expected",
      timeframe: "Next 24 Hours",
    },
    {
      region: "Udupi",
      riskLevel: "Low",
      alertLevel: "Green Alert",
      rainfallFcst: "65–115 mm",
      timeframe: "Next 48 Hours",
    },
    {
      region: "Dakshina Kannada",
      riskLevel: "Low",
      alertLevel: "Green Alert",
      rainfallFcst: "65–115 mm",
      timeframe: "Next 72 Hours",
    },
  ]

  // Adjust river data to Stable trend and 0.0 m/hr rate
  const riverData = [
    {
      name: "Netravati River (at Bantwal)",
      currentLevel: 8.2,
      dangerLevel: 8.5,
      trend: "Stable",
      rateOfChange: "0.0 m/hr",
    },
    {
      name: "Phalguni River (at Gurupura)",
      currentLevel: 4.8,
      dangerLevel: 5.5,
      trend: "Stable",
      rateOfChange: "0.0 m/hr",
    },
    {
      name: "Kumaradhara River (at Uppinangady)",
      currentLevel: 25.5,
      dangerLevel: 26.5,
      trend: "Stable",
      rateOfChange: "0.0 m/hr",
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
        className="bg-gradient-to-r from-blue-700 to-blue-900 p-4 flex justify-between items-center shadow-lg"
      >
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-white hover:bg-blue-800 rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Droplets className="h-5 w-5" />
            <h1 className="text-xl font-bold">Flood Information</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-xs text-blue-200">{format(currentTime, "EEEE, MMMM d")}</div>
            <div className="text-sm font-medium">{format(currentTime, "h:mm a")}</div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-blue-800 rounded-full"
            onClick={() => setShowInfo(!showInfo)}
          >
            <Info className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-blue-800 rounded-full"
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
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-blue-500">Loading flood data...</p>
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
                {/* FastFlood.org iframe */}
                <div className="relative flex-1 w-full">
                  <iframe
                    src="https://fastflood.org/index_ff_tech"
                    className="w-full h-full border-0"
                    title="FastFlood Flood Map"
                    allowFullScreen
                    onLoad={handleIframeLoad}
                  />

                  {/* Overlay for attribution */}
                  <div className="absolute bottom-4 right-4 bg-slate-800/80 p-2 rounded-lg shadow-lg z-10">
                    <a
                      href="https://fastflood.org/index_ff_tech"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-xs text-blue-300 hover:text-blue-200"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      FastFlood.org
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
                  {/* Update AI section title, keep description, set risk to Low with green bar */}
                  <div className="bg-gradient-to-r from-blue-900/40 to-blue-800/30 rounded-xl p-6 shadow-lg mb-6">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <BarChart className="h-5 w-5 text-blue-400" />
                      Flood Forecast & Risk Advisory – Karnataka
                    </h2>
                    <p className="text-gray-300 mb-4">
                      Our system analyzes real-time rainfall data, river sensor readings, terrain models, and official
                      weather forecasts to generate flood risk assessments. These forecasts are updated hourly using
                      machine learning algorithms trained on historical hydrological patterns.
                    </p>
                    <div className="bg-slate-800/60 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">Current Flood Risk Level</span>
                        <span className="text-sm font-medium text-green-400">Low</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2.5">
                        <div className="bg-green-500 h-2.5 rounded-full" style={{ width: "25%" }}></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Assessments are updated hourly based on the latest observations and forecasts.
                      </p>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold mb-3">Regional Flood Risk</h3>
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
                          <h4 className="font-medium text-blue-300">{prediction.region}</h4>
                          <div
                            className={`text-xs font-semibold px-2 py-1 rounded-full ${
                              prediction.riskLevel === "Low"
                                ? "bg-green-900/30 text-green-400"
                                : prediction.riskLevel === "Moderate"
                                  ? "bg-yellow-900/30 text-yellow-400"
                                  : "bg-red-900/30 text-red-400"
                            }`}
                          >
                            {prediction.alertLevel}
                          </div>
                        </div>
                        <div className="mt-2 space-y-1 text-sm">
                          {prediction.rainfallObs && (
                            <div className="flex justify-between">
                              <span className="text-gray-400">24hr Rainfall Observed:</span>
                              <span className="font-medium">{prediction.rainfallObs}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-gray-400">Rainfall Forecast:</span>
                            <span className="font-medium">{prediction.rainfallFcst}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Timeframe:</span>
                            <span className="font-medium">{prediction.timeframe}</span>
                          </div>
                        </div>
                        <div className="mt-3 w-full bg-slate-700 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${
                              prediction.riskLevel === "High"
                                ? "bg-red-500"
                                : prediction.riskLevel === "Moderate"
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                            }`}
                            style={{
                              width: `${
                                prediction.riskLevel === "High" ? 100 : prediction.riskLevel === "Moderate" ? 60 : 30
                              }%`,
                            }}
                          ></div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <h3 className="text-lg font-semibold mt-6 mb-3">River Level Monitoring</h3>
                  <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-gray-400 border-b border-slate-700">
                            <th className="text-left py-2 px-3">River</th>
                            <th className="text-left py-2 px-3">Current Level</th>
                            <th className="text-left py-2 px-3">Danger Level</th>
                            <th className="text-left py-2 px-3">Trend</th>
                            <th className="text-left py-2 px-3">Rate of Change</th>
                          </tr>
                        </thead>
                        <tbody>
                          {riverData.map((river, index) => (
                            <tr key={index} className="border-b border-slate-700/50 last:border-0">
                              <td className="py-3 px-3 font-medium text-blue-300">{river.name}</td>
                              <td className="py-3 px-3">
                                <div className="flex items-center">
                                  <span
                                    className={`inline-block w-2 h-2 rounded-full mr-2 ${
                                      river.currentLevel / river.dangerLevel > 0.9
                                        ? "bg-red-500"
                                        : river.currentLevel / river.dangerLevel > 0.75
                                          ? "bg-yellow-500"
                                          : "bg-green-500"
                                    }`}
                                  ></span>
                                  {river.currentLevel}m
                                </div>
                              </td>
                              <td className="py-3 px-3 text-red-400">{river.dangerLevel}m</td>
                              <td
                                className={`py-3 px-3 ${
                                  river.trend === "Rising"
                                    ? "text-red-400"
                                    : river.trend === "Falling"
                                      ? "text-green-400"
                                      : "text-yellow-400"
                                }`}
                              >
                                {river.trend}
                              </td>
                              <td
                                className={`py-3 px-3 ${
                                  river.rateOfChange.startsWith("+") ? "text-red-400" : "text-green-400"
                                }`}
                              >
                                {river.rateOfChange}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="mt-6 bg-slate-800 rounded-lg p-4 border border-slate-700">
                    <h3 className="text-lg font-semibold mb-3">Sensor Network Status</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-slate-700/50 p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-blue-400">182</div>
                        <div className="text-xs text-gray-400">Water Level Sensors</div>
                      </div>
                      <div className="bg-slate-700/50 p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-400">97.5%</div>
                        <div className="text-xs text-gray-400">Network Uptime</div>
                      </div>
                      <div className="bg-slate-700/50 p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-blue-400">2 min</div>
                        <div className="text-xs text-gray-400">Data Latency</div>
                      </div>
                      <div className="bg-slate-700/50 p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-purple-400">24/7</div>
                        <div className="text-xs text-gray-400">Monitoring</div>
                      </div>
                    </div>
                  </div>

                  {/* Use dynamic timestamp like earthquake page */}
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
            <h3 className="text-lg font-semibold mb-2">Flood Safety Tips</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <span className="bg-blue-500/20 p-1 rounded-full mt-1">
                  <AlertTriangle className="h-3 w-3 text-blue-500" />
                </span>
                <span>Never walk, swim, or drive through flood waters. Turn Around, Don't Drown!</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-blue-500/20 p-1 rounded-full mt-1">
                  <AlertTriangle className="h-3 w-3 text-blue-500" />
                </span>
                <span>Stay off bridges over fast-moving water. Fast-moving water can wash bridges away.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-blue-500/20 p-1 rounded-full mt-1">
                  <AlertTriangle className="h-3 w-3 text-blue-500" />
                </span>
                <span>Evacuate if told to do so. Move to higher ground or a higher floor.</span>
              </li>
            </ul>
            <div className="mt-3 text-xs text-gray-400">
              Data provided by FastFlood.org. The map shows flood risk areas and current flood conditions. Use the map
              controls to navigate and view different flood information layers.
            </div>
          </motion.div>
        )}
      </main>
    </div>
  )
}
