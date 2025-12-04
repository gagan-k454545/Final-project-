"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Flame,
  RefreshCw,
  AlertTriangle,
  ThermometerSun,
  ExternalLink,
  Info,
  Globe,
  BarChart,
} from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { motion } from "framer-motion"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function FirePage() {
  const [loading, setLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [fireRiskLevel, setFireRiskLevel] = useState("Low")
  const [showInfo, setShowInfo] = useState(false)
  const [iframeLoaded, setIframeLoaded] = useState(false)
  const [activeTab, setActiveTab] = useState("live")
  const [activeFires, setActiveFires] = useState([
    {
      id: 1,
      name: "Bandipur Forest",
      location: "Karnataka",
      status: "Contained / Controlled",
      size: "350 acres",
      containment: "40%",
      updated: "11:07 PM",
    },
    {
      id: 2,
      name: "Nagarahole Tiger Reserve",
      location: "Karnataka",
      status: "Contained / Controlled",
      size: "500 acres",
      containment: "15%",
      updated: "10:43 PM",
    },
    {
      id: 3,
      name: "MM Hills Wildlife Sanctuary",
      location: "Karnataka",
      status: "Contained / Controlled",
      size: "120 acres",
      containment: "75%",
      updated: "10:58 PM",
    },
  ])

  const riskMeta = {
    Low: { percent: 20, chipBg: "bg-green-500/15", chipText: "text-green-300", fill: "bg-green-500" },
    Moderate: { percent: 50, chipBg: "bg-amber-500/15", chipText: "text-amber-300", fill: "bg-amber-500" },
    High: { percent: 75, chipBg: "bg-orange-500/15", chipText: "text-orange-300", fill: "bg-orange-500" },
    Extreme: { percent: 95, chipBg: "bg-red-500/15", chipText: "text-red-300", fill: "bg-red-500" },
  } as const
  const meta = riskMeta[fireRiskLevel as keyof typeof riskMeta]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    const loadTimer = setTimeout(() => {
      if (!iframeLoaded && activeTab === "live") {
        setLoading(false)
      } else if (activeTab === "info") {
        setLoading(false)
      }
    }, 1500)

    return () => {
      clearInterval(timer)
      clearTimeout(loadTimer)
    }
  }, [iframeLoaded, activeTab])

  useEffect(() => {
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
        className="bg-gradient-to-r from-red-700 to-red-900 p-4 flex justify-between items-center shadow-lg"
      >
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-white hover:bg-red-800 rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5" />
            <h1 className="text-xl font-bold">Fire Information</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-xs text-red-200">{format(currentTime, "EEEE, MMMM d")}</div>
            <div className="text-sm font-medium">{format(currentTime, "h:mm a")}</div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-red-800 rounded-full"
            onClick={() => setShowInfo(!showInfo)}
          >
            <Info className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-red-800 rounded-full"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="h-5 w-5" />
          </Button>
        </div>
      </motion.header>

      <div className="bg-slate-800 px-4 py-2 border-b border-slate-700">
        <Tabs defaultValue="live" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
            <TabsTrigger value="live" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span>Live Data</span>
            </TabsTrigger>
            <TabsTrigger value="info" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              <span>Fire Status</span>
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
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mb-4"></div>
              <p className="text-red-500">Loading fire data...</p>
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
                {/* NASA FIRMS iframe */}
                <div className="relative flex-1 w-full">
                  <iframe
                    src="https://firms.modaps.eosdis.nasa.gov/map/#d:24hrs;@0.0,0.0,3.0z"
                    className="w-full h-full border-0"
                    title="NASA FIRMS Fire Map"
                    allowFullScreen
                    onLoad={handleIframeLoad}
                  />

                  {/* Overlay for attribution */}
                  <div className="absolute bottom-4 right-4 bg-slate-800/80 p-2 rounded-lg shadow-lg z-10">
                    <a
                      href="https://firms.modaps.eosdis.nasa.gov/map/#d:24hrs;@0.0,0.0,3.0z"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-xs text-red-300 hover:text-red-200"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      NASA FIRMS
                    </a>
                  </div>
                </div>
              </motion.div>
            ) : (
              /* Fire status information tab */
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="h-full overflow-auto p-4 md:p-6"
              >
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-red-900/40 to-red-800/30 rounded-xl p-6 shadow-lg">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold">Current Fire Risk</h2>
                      <div
                        className={`px-3 py-1 rounded-full font-medium text-sm flex items-center gap-1 ${meta.chipBg} ${meta.chipText}`}
                      >
                        <ThermometerSun className="h-4 w-4" />
                        {fireRiskLevel}
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="w-full rounded-full h-3 overflow-hidden relative">
                        <div
                          className="absolute inset-0 rounded-full opacity-40"
                          style={{
                            background:
                              "linear-gradient(90deg, rgba(34,197,94,1) 0%, rgba(234,179,8,1) 50%, rgba(234,88,12,1) 75%, rgba(239,68,68,1) 100%)",
                          }}
                          aria-hidden="true"
                        />
                        <motion.div
                          className={`relative h-3 ${meta.fill}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${meta.percent}%` }}
                          transition={{ type: "spring", stiffness: 140, damping: 18 }}
                          role="progressbar"
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-valuenow={meta.percent}
                          aria-label="Current fire risk level"
                        />
                      </div>

                      <div className="grid grid-cols-4 text-xs mt-2">
                        <span
                          className={`text-center ${fireRiskLevel === "Low" ? "text-green-300 font-medium" : "text-gray-400"}`}
                        >
                          Low
                        </span>
                        <span
                          className={`text-center ${fireRiskLevel === "Moderate" ? "text-amber-300 font-medium" : "text-gray-400"}`}
                        >
                          Moderate
                        </span>
                        <span
                          className={`text-center ${fireRiskLevel === "High" ? "text-orange-300 font-medium" : "text-gray-400"}`}
                        >
                          High
                        </span>
                        <span
                          className={`text-center ${fireRiskLevel === "Extreme" ? "text-red-300 font-medium" : "text-gray-400"}`}
                        >
                          Extreme
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 text-gray-300 text-sm">
                      <p>
                        Current conditions indicate a low fire risk in forested regions of Karnataka due to recent
                        rainfall and mild temperatures. Stay vigilant.
                      </p>
                      <p className="text-xs text-gray-400 mt-2">Last updated: {format(currentTime, "MMM d, h:mm a")}</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl p-4 shadow-lg">
                    <h2 className="text-lg font-semibold mb-3">Active Fires</h2>
                    <div className="space-y-3">
                      {activeFires.map((fire) => (
                        <div
                          key={fire.id}
                          className={`bg-slate-900/60 rounded-lg p-4 border-l-4 ${
                            fire.status === "Active" && Number.parseInt(fire.containment) < 50
                              ? "border-red-500"
                              : fire.status === "Active"
                                ? "border-amber-500"
                                : "border-green-500"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium">{fire.name}</h3>
                              <p className="text-sm text-gray-400">{fire.location}</p>
                            </div>
                            <div className="text-right">
                              <div
                                className={`text-sm font-medium ${
                                  fire.status === "Active" ? "text-red-400" : "text-green-400"
                                }`}
                              >
                                {fire.status}
                              </div>
                              <p className="text-sm text-gray-400">{fire.containment} contained</p>
                            </div>
                          </div>
                          <div className="mt-2 text-sm text-gray-300">
                            <p>Size: {fire.size}</p>
                            <p className="text-xs text-gray-400 mt-1">Updated: {fire.updated}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl p-4 shadow-lg">
                    <h2 className="text-lg font-semibold mb-3">Fire Safety Tips</h2>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex items-start gap-2">
                        <span className="bg-red-500/20 p-1 rounded-full mt-1">
                          <AlertTriangle className="h-3 w-3 text-red-500" />
                        </span>
                        <span>Create a defensible space around your home by clearing vegetation.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="bg-red-500/20 p-1 rounded-full mt-1">
                          <AlertTriangle className="h-3 w-3 text-red-500" />
                        </span>
                        <span>Have an emergency evacuation plan and practice it with your family.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="bg-red-500/20 p-1 rounded-full mt-1">
                          <AlertTriangle className="h-3 w-3 text-red-500" />
                        </span>
                        <span>Keep emergency supplies, important documents, and medications ready to go.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="bg-red-500/20 p-1 rounded-full mt-1">
                          <AlertTriangle className="h-3 w-3 text-red-500" />
                        </span>
                        <span>If ordered to evacuate, do so immediately. Don't wait to see how the fire develops.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {showInfo && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-slate-800 p-4 border-t border-slate-700"
          >
            <h3 className="text-lg font-semibold mb-2">Fire Monitoring</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <span className="bg-red-500/20 p-1 rounded-full mt-1">
                  <AlertTriangle className="h-3 w-3 text-red-500" />
                </span>
                <span>NASA FIRMS provides real-time fire detection data from satellites.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-red-500/20 p-1 rounded-full mt-1">
                  <AlertTriangle className="h-3 w-3 text-red-500" />
                </span>
                <span>The map shows active fire incidents and thermal anomalies across the region.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-red-500/20 p-1 rounded-full mt-1">
                  <AlertTriangle className="h-3 w-3 text-red-500" />
                </span>
                <span>Data is updated regularly with 24-hour and historical observations.</span>
              </li>
            </ul>
            <div className="mt-3 text-xs text-gray-400">
              Data provided by NASA's Fire Information for Resource Management System (FIRMS). Use the map controls to
              navigate and view different fire detection sources and timeframes.
            </div>
          </motion.div>
        )}
      </main>
    </div>
  )
}
