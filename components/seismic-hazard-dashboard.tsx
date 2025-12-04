"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, RefreshCw, BarChart3, Activity } from "lucide-react"

export function SeismicHazardDashboard() {
  const [activeTab, setActiveTab] = useState<"live" | "predictions">("predictions")

  const regions = [
    {
      name: "Coastal Karnataka",
      zone: "Zone III (Moderate Risk)",
      zoneBadgeColor: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
      lastEvent: "No significant tremors",
      recentActivity: "0 tremors",
    },
    {
      name: "Kalaburagi Region",
      zone: "Zone III (Moderate Risk)",
      zoneBadgeColor: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
      lastEvent: "2.3 Mag (Sep 2025)",
      recentActivity: "A few minor tremors earlier",
    },
    {
      name: "Kodagu & Hassan Region",
      zone: "Zone II (Low Risk)",
      zoneBadgeColor: "bg-green-500/20 text-green-300 border-green-500/30",
      lastEvent: "1.6 Mag (ABP Live)",
      recentActivity: "Low activity",
    },
    {
      name: "Ballari & Chitradurga",
      zone: "Zone II (Low Risk)",
      zoneBadgeColor: "bg-green-500/20 text-green-300 border-green-500/30",
      lastEvent: "No recorded recent events",
      recentActivity: "Low activity",
    },
  ]

  const sensorStats = [
    { label: "6 Active Sensors", icon: "📡" },
    { label: "98.2% Network Uptime", color: "text-green-400", icon: "✓" },
    { label: "5 min Data Latency", color: "text-blue-400", icon: "⏱" },
    { label: "24/7 Monitoring", icon: "🔍" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4 md:p-6">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between mb-8"
      >
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-300 hover:text-white hover:bg-slate-700/50 rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Karnataka - Live Seismic Hazard Analysis</h1>
            <p className="text-sm text-gray-400 mt-1">Real-time earthquake monitoring and prediction</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="text-sm text-gray-300">Wednesday, December 3, 2025 - 10:18 PM</div>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-300 hover:text-white hover:bg-slate-700/50 rounded-full"
          >
            <RefreshCw className="h-5 w-5" />
          </Button>
        </div>
      </motion.div>

      {/* Tab Toggle for Live Data / AI Predictions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex justify-center gap-4 mb-8"
      >
        <button
          onClick={() => setActiveTab("live")}
          className={`px-6 py-2 rounded-full font-medium transition-all ${
            activeTab === "live"
              ? "bg-red-600 text-white shadow-lg shadow-red-500/30"
              : "bg-slate-700/50 text-gray-300 hover:bg-slate-600/50"
          }`}
        >
          Live Data
        </button>
        <button
          onClick={() => setActiveTab("predictions")}
          className={`px-6 py-2 rounded-full font-medium transition-all ${
            activeTab === "predictions"
              ? "bg-red-600 text-white shadow-lg shadow-red-500/30"
              : "bg-slate-700/50 text-gray-300 hover:bg-slate-600/50"
          }`}
        >
          AI Predictions
        </button>
      </motion.div>

      {/* Main Hero Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <Card className="bg-gradient-to-br from-red-900/40 to-red-800/30 border border-red-600/30 shadow-2xl overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-start gap-6 p-8">
              <div className="flex-shrink-0">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  className="p-4 bg-red-600/20 rounded-full border border-red-500/30"
                >
                  <BarChart3 className="h-8 w-8 text-red-400" />
                </motion.div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">Earthquake Monitoring and Prediction – Karnataka</h2>
                <p className="text-gray-200 mb-6 leading-relaxed">
                  The system monitors real-time seismic data from observatories across Karnataka, analyzing historical
                  patterns and regional geology to assess current hazard levels.
                </p>

                {/* Prediction Confidence Progress Bar */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-300">Prediction Confidence</span>
                    <span className="text-lg font-bold text-orange-400">72%</span>
                  </div>
                  <div className="h-3 bg-slate-700/50 rounded-full overflow-hidden border border-slate-600/50">
                    <motion.div
                      className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: "72%" }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>

                <p className="text-xs text-gray-400">
                  Based on the Karnataka State seismic monitoring network — latest data.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Regional Predictions Grid */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
      >
        {regions.map((region, index) => (
          <motion.div
            key={index}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card className="bg-slate-700/40 border border-slate-600/30 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg font-bold">{region.name}</CardTitle>
                  <Badge className={`${region.zoneBadgeColor} border`}>{region.zone}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Last Event</p>
                  <p className="text-sm font-medium text-white">{region.lastEvent}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Recent Activity</p>
                  <p className="text-sm font-medium text-white">{region.recentActivity}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Sensor Network Status Footer */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-slate-900/80 rounded-2xl p-6 border border-slate-700/50"
      >
        <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
          <Activity className="h-5 w-5 text-blue-400" />
          Sensor Network Status
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {sensorStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="bg-slate-800/60 rounded-xl p-4 border border-slate-600/30 text-center hover:bg-slate-700/60 transition-colors"
            >
              <div className="text-2xl mb-2">{stat.icon}</div>
              <p className={`text-sm font-medium ${stat.color || "text-white"}`}>{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
