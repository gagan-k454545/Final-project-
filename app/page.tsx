"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Menu,
  Bell,
  Home,
  User,
  AlertTriangle,
  Droplets,
  Flame,
  Cloud,
  MapPin,
  Phone,
  Briefcase,
  FileText,
  Navigation,
  Crosshair,
  ExternalLink,
  Languages,
} from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { useToast } from "@/components/ui/use-toast"
import { useIsMobile as useMobile } from "@/hooks/use-mobile"
import { motion, AnimatePresence } from "framer-motion"
import { Slider } from "@/components/ui/slider"
import { Shield, Settings, Info } from "lucide-react"
import { useLanguage, type Language } from "@/hooks/use-language"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function DisasterManagementApp() {
  const [activeTab, setActiveTab] = useState("home")
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number
    lng: number
    address: string
  } | null>(null)
  const [locationLoading, setLocationLoading] = useState(false)
  const isMobile = useMobile()
  const { toast } = useToast()
  const { t, language, setLanguage } = useLanguage()

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    // Show welcome toast
    toast({
      title: t("welcomeTitle"),
      description: t("welcomeDescription"),
      duration: 5000,
    })

    // Request location on load
    getCurrentLocation()

    return () => clearInterval(timer)
  }, [toast, t])

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: t("locationNotSupported"),
        description: t("browserNoGeolocation"),
        variant: "destructive",
      })
      return
    }

    setLocationLoading(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords

        // Try OpenCage first (demo), then fallback to Nominatim, then raw coords
        try {
          let address = ""
          try {
            const ocRes = await fetch(
              `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=demo&limit=1`,
            )
            if (ocRes.ok) {
              const data = await ocRes.json()
              address = data.results?.[0]?.formatted || ""
            }
          } catch (e) {
            // ignore OpenCage error, we'll fallback
          }

          if (!address) {
            const nomRes = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            )
            if (nomRes.ok) {
              const data = await nomRes.json()
              address = data?.display_name || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
            }
          }

          setCurrentLocation({
            lat: latitude,
            lng: longitude,
            address: address || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
          })

          toast({
            title: t("locationDetectedTitle"),
            description: `${t("currentLocation")}: ${address || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`}`,
            duration: 4000,
          })
        } catch {
          setCurrentLocation({
            lat: latitude,
            lng: longitude,
            address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
          })
        }
        setLocationLoading(false)
      },
      (error) => {
        setLocationLoading(false)
        toast({
          title: t("locationAccessDenied"),
          description: t("enableLocationForEmergency"),
          variant: "destructive",
        })
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
    )
  }

  const callEmergency = (number: string) => {
    if (typeof window !== "undefined") {
      window.location.href = `tel:${number}`
    }
  }

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  }

  const slideUp = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Enhanced animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none hidden md:block">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-3/4 left-1/3 w-32 h-32 bg-green-500/3 rounded-full blur-2xl animate-pulse animation-delay-3000"></div>
      </div>

      {/* Enhanced Header */}
      <header className="relative bg-gradient-to-r from-red-700 via-red-800 to-red-900 p-4 flex justify-between items-center shadow-2xl border-b border-red-600/20">
        <motion.div
          className="flex items-center gap-3"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <Shield className="h-7 w-7 text-white drop-shadow-lg" />
            </motion.div>
            <div className="absolute inset-0 bg-white/20 rounded-full blur-sm"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white drop-shadow-lg">{t("appTitle")}</h1>
            <p className="text-xs text-red-200">{t("appSubtitle")}</p>
          </div>
        </motion.div>

        <div className="flex items-center gap-3">
          {currentLocation && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="hidden md:flex items-center gap-2 bg-red-800/30 px-3 py-1 rounded-full border border-red-500/30 backdrop-blur-sm"
            >
              <MapPin className="h-4 w-4 text-red-300" />
              <span className="text-xs text-red-200 max-w-32 truncate">{currentLocation.address.split(",")[0]}</span>
            </motion.div>
          )}

          <motion.div
            className="text-right hidden sm:block"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="text-xs text-red-200">{format(currentTime, "EEEE, MMMM d, yyyy")}</div>
            <div className="text-sm font-medium text-white">{format(currentTime, "h:mm a")}</div>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-red-800/50 rounded-full backdrop-blur-sm border border-white/10"
            >
              <Bell className="h-5 w-5" />
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-red-800/50 rounded-full backdrop-blur-sm border border-white/10"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </header>

      {/* Enhanced Side Menu - Fixed scrolling issue by adding proper overflow handling */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute right-0 top-0 h-full w-80 bg-gradient-to-b from-slate-900 to-slate-800 shadow-2xl border-l border-slate-700/50 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-bold text-white">{t("emergencyMenu")}</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-slate-700/50 rounded-full"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    ✕
                  </Button>
                </div>

                <div className="mb-8 p-5 bg-gradient-to-br from-red-900/30 to-red-800/20 rounded-2xl border border-red-500/30 backdrop-blur-sm">
                  <h3 className="text-lg font-bold text-red-300 mb-4 flex items-center gap-3">
                    <Phone className="h-5 w-5" />
                    {t("emergencyNumbers")}
                  </h3>
                  <div className="space-y-3">
                    {[
                      { label: t("emergencyAll"), number: "112", color: "bg-red-600", icon: "🚨" },
                      { label: t("police"), number: "100", color: "bg-blue-600", icon: "👮" },
                      { label: t("fire"), number: "101", color: "bg-orange-600", icon: "🚒" },
                      { label: t("ambulance"), number: "102", color: "bg-green-600", icon: "🚑" },
                      { label: t("healthHelpline"), number: "104", color: "bg-purple-600", icon: "🏥" },
                    ].map((emergency, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.02, x: 5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => callEmergency(emergency.number)}
                        className="w-full flex items-center justify-between p-4 bg-slate-800/50 hover:bg-slate-700/70 rounded-xl border border-slate-600/30 transition-all duration-300 group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-xl">{emergency.icon}</div>
                          <div className="text-left">
                            <div className="text-slate-200 font-medium">{emergency.label}</div>
                            <div className="text-xs text-slate-400">{t("tapToCall")}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-mono text-lg bg-slate-700/50 px-3 py-1 rounded-lg">
                            {emergency.number}
                          </span>
                          <Phone className="h-4 w-4 text-green-400 group-hover:text-green-300" />
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-white hover:bg-slate-700/50 rounded-xl p-4 h-auto"
                      onClick={() => {
                        setActiveTab("home")
                        setIsMenuOpen(false)
                      }}
                    >
                      <Home className="h-5 w-5 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">{t("home")}</div>
                        <div className="text-xs text-slate-400">{t("dashboardAlerts")}</div>
                      </div>
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-white hover:bg-slate-700/50 rounded-xl p-4 h-auto"
                      onClick={() => {
                        setActiveTab("profile")
                        setIsMenuOpen(false)
                      }}
                    >
                      <User className="h-5 w-5 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">{t("profile")}</div>
                        <div className="text-xs text-slate-400">{t("personalSettings")}</div>
                      </div>
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-white hover:bg-slate-700/50 rounded-xl p-4 h-auto"
                    >
                      <Settings className="h-5 w-5 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">{t("settings")}</div>
                        <div className="text-xs text-slate-400">{t("appConfiguration")}</div>
                      </div>
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-white hover:bg-slate-700/50 rounded-xl p-4 h-auto"
                    >
                      <Info className="h-5 w-5 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">{t("about")}</div>
                        <div className="text-xs text-slate-400">{t("appInformation")}</div>
                      </div>
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-4 relative z-10">
        {activeTab === "home" && (
          <HomeContent
            currentTime={currentTime}
            currentLocation={currentLocation}
            locationLoading={locationLoading}
            getCurrentLocation={getCurrentLocation}
          />
        )}
        {activeTab === "profile" && (
          <ProfileSection
            currentTime={currentTime}
            currentLocation={currentLocation}
            locationLoading={locationLoading}
            getCurrentLocation={getCurrentLocation}
          />
        )}
      </main>

      {/* Enhanced Bottom Navigation */}
      <motion.div
        className="relative bg-slate-900/90 backdrop-blur-xl md:backdrop-blur-xl border-t border-slate-700/50 p-3 md:p-3"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex justify-around max-w-md mx-auto">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              className={`flex flex-col items-center p-3 rounded-2xl transition-all duration-300 ${
                activeTab === "home"
                  ? "text-red-400 bg-red-500/10 border border-red-500/20 shadow-lg shadow-red-500/10"
                  : "text-gray-400 hover:text-white hover:bg-slate-800/50"
              }`}
              onClick={() => setActiveTab("home")}
            >
              <Home className="h-6 w-6 mb-1" />
              <span className="text-xs font-medium">{t("home")}</span>
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              className={`flex flex-col items-center p-3 rounded-2xl transition-all duration-300 ${
                activeTab === "profile"
                  ? "text-red-400 bg-red-500/10 border border-red-500/20 shadow-lg shadow-red-500/10"
                  : "text-gray-400 hover:text-white hover:bg-slate-800/50"
              }`}
              onClick={() => setActiveTab("profile")}
            >
              <User className="h-6 w-6 mb-1" />
              <span className="text-xs font-medium">{t("profile")}</span>
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Floating SOS FAB */}
      <button
        aria-label="Emergency SOS"
        className="fixed right-4 bottom-24 md:right-6 md:bottom-6 z-40 h-16 w-16 rounded-full bg-red-600 text-white font-extrabold shadow-lg shadow-red-500/30 active:scale-95 transition-transform"
        onClick={() => alert(t("emergencySOS"))}
      >
        SOS
      </button>
    </div>
  )
}

function HomeContent({
  currentTime,
  currentLocation,
  locationLoading,
  getCurrentLocation,
}: {
  currentTime: Date
  currentLocation: { lat: number; lng: number; address: string } | null
  locationLoading: boolean
  getCurrentLocation: () => void
}) {
  const { t } = useLanguage()

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
    >
      <motion.div
        variants={{
          hidden: { y: 20, opacity: 0 },
          visible: { y: 0, opacity: 1 },
        }}
        className="relative overflow-hidden bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 rounded-2xl p-6 shadow-2xl"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-red-500/20 backdrop-blur-sm"></div>
        <div className="relative flex items-start gap-4">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
            className="flex-shrink-0"
          >
            <AlertTriangle className="h-8 w-8 text-white drop-shadow-lg" />
          </motion.div>
          <div className="flex-1">
            <h3 className="font-bold text-white text-lg mb-2">{t("monsoonAlert")}</h3>
            <p className="text-white/90 text-sm leading-relaxed mb-3">{t("monsoonDescription")}</p>
            <div className="flex items-center gap-4 text-xs text-amber-100">
              <span>
                {t("updated")}: {format(currentTime, "h:mm a")}
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                {t("liveUpdates")}
              </span>
              {currentLocation && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {t("yourArea")}
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <motion.h2
        variants={{
          hidden: { y: 20, opacity: 0 },
          visible: { y: 0, opacity: 1 },
        }}
        className="text-xl font-bold mt-8 mb-4 text-white flex items-center gap-3"
      >
        <div className="bg-red-500/20 p-2 rounded-xl">
          <Info className="h-6 w-6 text-red-400" />
        </div>
        {t("disasterInformation")}
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          variants={{
            hidden: { y: 20, opacity: 0 },
            visible: { y: 0, opacity: 1 },
          }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <Link href="/earthquake" className="block">
            <Card className="relative overflow-hidden bg-gradient-to-br from-orange-900/60 via-orange-800/40 to-orange-950/60 border border-orange-500/20 shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent"></div>
              <CardContent className="relative p-6">
                <div className="flex items-start gap-4">
                  <motion.div
                    className="bg-orange-500/20 p-4 rounded-2xl border border-orange-500/30"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <AlertTriangle className="h-7 w-7 text-orange-400" />
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white text-lg mb-2">{t("earthquakeInformation")}</h3>
                    <p className="text-orange-200/80 text-sm leading-relaxed mb-3">{t("earthquakeDescription")}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-orange-300/60">
                        {t("updated")}: {format(currentTime, "h:mm a")}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-green-400">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        {t("safe")}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </motion.div>

        <motion.div
          variants={{
            hidden: { y: 20, opacity: 0 },
            visible: { y: 0, opacity: 1 },
          }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <Link href="/flood" className="block">
            <Card className="relative overflow-hidden bg-gradient-to-br from-blue-900/60 via-blue-800/40 to-blue-950/60 border border-blue-500/20 shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent"></div>
              <CardContent className="relative p-6">
                <div className="flex items-start gap-4">
                  <motion.div
                    className="bg-blue-500/20 p-4 rounded-2xl border border-blue-500/30"
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Droplets className="h-7 w-7 text-blue-400" />
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white text-lg mb-2">{t("floodInformation")}</h3>
                    <p className="text-blue-200/80 text-sm leading-relaxed mb-3">{t("floodDescription")}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-blue-300/60">
                        {t("updated")}: {format(currentTime, "h:mm a")}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-yellow-400">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                        {t("moderateRisk")}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </motion.div>

        <motion.div
          variants={{
            hidden: { y: 20, opacity: 0 },
            visible: { y: 0, opacity: 1 },
          }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <Link href="/fire" className="block">
            <Card className="relative overflow-hidden bg-gradient-to-br from-red-900/60 via-red-800/40 to-red-950/60 border border-red-500/20 shadow-2xl hover:shadow-red-500/10 transition-all duration-500 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent"></div>
              <CardContent className="relative p-6">
                <div className="flex items-start gap-4">
                  <motion.div
                    className="bg-red-500/20 p-4 rounded-2xl border border-red-500/30"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Flame className="h-7 w-7 text-red-400" />
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white text-lg mb-2">{t("fireInformation")}</h3>
                    <p className="text-red-200/80 text-sm leading-relaxed mb-3">{t("fireDescription")}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-red-300/60">
                        {t("updated")}: {format(currentTime, "MMM d, h:mm a")}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-green-400">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        {t("lowRisk")}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </motion.div>

        <motion.div
          variants={{
            hidden: { y: 20, opacity: 0 },
            visible: { y: 0, opacity: 1 },
          }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <Link href="/weather" className="block">
            <Card className="relative overflow-hidden bg-gradient-to-br from-cyan-900/60 via-cyan-800/40 to-cyan-950/60 border border-cyan-500/20 shadow-2xl hover:shadow-cyan-500/10 transition-all duration-500 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent"></div>
              <CardContent className="relative p-6">
                <div className="flex items-start gap-4">
                  <motion.div
                    className="bg-cyan-500/20 p-4 rounded-2xl border border-cyan-500/30"
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Cloud className="h-7 w-7 text-cyan-400" />
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white text-lg mb-2">{t("weatherIntelligence")}</h3>
                    <p className="text-cyan-200/80 text-sm leading-relaxed mb-3">{t("weatherDescription")}</p>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="mb-3">
                      {/* replace Zoom Earth link with AccuWeather + #google_vignette in Weather card */}
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 rounded-xl bg-transparent text-xs"
                        onClick={() =>
                          window.open("https://www.accuweather.com/en/in/national/satellite#google_vignette", "_blank")
                        }
                      >
                        <ExternalLink className="h-3 w-3 mr-2" />
                        {t("viewLiveWeatherMap")}
                      </Button>
                    </motion.div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-cyan-300/60">
                        {t("updated")}: {format(currentTime, "h:mm a")}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-blue-400">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                        {t("rainy")}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  )
}

function ProfileSection({
  currentTime,
  currentLocation,
  locationLoading,
  getCurrentLocation,
}: {
  currentTime: Date
  currentLocation: { lat: number; lng: number; address: string } | null
  locationLoading: boolean
  getCurrentLocation: () => void
}) {
  const [selectedLocation, setSelectedLocation] = useState({
    name: "Mangaluru, Karnataka",
    lat: 12.9141,
    lng: 74.856,
  })
  const [emergencyContacts, setEmergencyContacts] = useState([
    { name: "Gautham Bekal", relation: "Self", phone: "+91 98765-43210" },
    { name: "Priya Sharma", relation: "Spouse", phone: "+91 87654-32109" },
  ])
  const [showAddContact, setShowAddContact] = useState(false)
  const [newContact, setNewContact] = useState({ name: "", relation: "", phone: "" })
  const [activeTab, setActiveTab] = useState("profile")
  const [notificationPreferences, setNotificationPreferences] = useState({
    sms: true,
    email: true,
    push: true,
    earthquake: true,
    flood: true,
    fire: true,
    weather: true,
  })
  const [appSettings, setAppSettings] = useState({
    locationServices: true,
    lowMotion: false, // data saver / reduce motion
    haptics: true,
  })
  const [masterPush, setMasterPush] = useState(true)
  const [alertSound, setAlertSound] = useState<"Default" | "Loud" | "Silent">("Default")
  const [textSize, setTextSize] = useState<number>(100) // percentage
  const [themeChoice, setThemeChoice] = useState<"system" | "light" | "dark">("system")

  const toggleAppSetting = (key: keyof typeof appSettings) => setAppSettings((s) => ({ ...s, [key]: !s[key] }))
  const { toast } = useToast()
  const { t, language, setLanguage } = useLanguage()

  const handleTabChange = (tab: string) => {
    if (tab === activeTab) {
      try {
        window.scrollTo({ top: 0, behavior: "smooth" })
      } catch {}
      return
    }
    setActiveTab(tab)
  }

  const predefinedLocations = [
    { name: "Mangaluru, Karnataka", lat: 12.9141, lng: 74.856 },
    { name: "Bantwal, Karnataka", lat: 12.8958, lng: 75.0347 },
  ]

  // Select a predefined location
  const selectLocation = (location: { name: string; lat: number; lng: number }) => {
    setSelectedLocation(location)

    toast({
      title: t("locationUpdated"),
      description: `${t("locationSetTo")} ${location.name}.`,
      duration: 3000,
    })
  }

  // Add new emergency contact
  const addEmergencyContact = () => {
    if (!newContact.name || !newContact.phone) {
      toast({
        title: t("missingInformation"),
        description: t("provideBothNamePhone"),
        variant: "destructive",
        duration: 3000,
      })
      return
    }

    setEmergencyContacts([...emergencyContacts, newContact])
    setNewContact({ name: "", relation: "", phone: "" })
    setShowAddContact(false)

    toast({
      title: t("contactAdded"),
      description: `${newContact.name} ${t("addedToEmergencyContacts")}.`,
      duration: 3000,
    })
  }

  // Toggle notification preference
  const toggleNotification = (key: keyof typeof notificationPreferences) => {
    setNotificationPreferences({
      ...notificationPreferences,
      [key]: !notificationPreferences[key],
    })

    toast({
      title: t("preferencesUpdated"),
      description: `${key.charAt(0).toUpperCase() + key.slice(1)} ${
        !notificationPreferences[key] ? t("notificationsEnabled") : t("notificationsDisabled")
      }.`,
      duration: 2000,
    })
  }

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
    >
      {/* Profile header with tabs */}
      <motion.div
        variants={{
          hidden: { y: 20, opacity: 0 },
          visible: { y: 0, opacity: 1 },
        }}
        className="relative overflow-hidden bg-gradient-to-br from-slate-800/80 via-slate-700/60 to-slate-800/80 rounded-2xl shadow-2xl backdrop-blur-sm border border-slate-600/30"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/10 via-transparent to-red-800/5"></div>
        <div className="relative bg-gradient-to-r from-red-900/20 to-red-800/10 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="relative">
              <motion.div
                className="h-24 w-24 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white shadow-2xl border border-red-500/30"
                whileHover={{ scale: 1.05, rotate: 2 }}
                transition={{ duration: 0.2 }}
              >
                <User className="h-12 w-12" />
              </motion.div>
              <motion.div
                className="absolute -bottom-2 -right-2 bg-green-500 h-6 w-6 rounded-full border-3 border-slate-800 flex items-center justify-center"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </motion.div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-1">Gautham Bekal</h2>
              <p className="text-gray-300 flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-red-400" />
                {currentLocation ? currentLocation.address.split(",")[0] : selectedLocation.name}
              </p>
              <p className="text-xs text-gray-400">Last updated: {format(currentTime, "MMM d, h:mm a")}</p>
            </div>
            <div className="flex flex-col gap-3">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 border-none shadow-lg text-white font-medium px-4 py-2 rounded-xl"
                >
                  <Bell className="h-4 w-4 mr-2" />
                  {t("emergencySOS")}
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-slate-500/50 text-slate-300 hover:bg-slate-700/50 rounded-xl backdrop-blur-sm bg-transparent"
                >
                  <User className="h-4 w-4 mr-2" />
                  {t("editProfile")}
                </Button>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="relative border-b border-slate-700/50">
          <div className="flex">
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleTabChange("profile")}
              className={`px-6 py-4 text-sm font-medium flex-1 transition-all duration-300 ${
                activeTab === "profile"
                  ? "text-red-400 border-b-2 border-red-500 bg-red-500/5"
                  : "text-gray-400 hover:text-gray-300 hover:bg-slate-700/30"
              }`}
            >
              {t("profileTab")}
            </motion.button>
            {/* Notifications tab */}
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleTabChange("notifications")}
              className={`px-6 py-4 text-sm font-medium flex-1 transition-all duration-300 ${
                activeTab === "notifications"
                  ? "text-red-400 border-b-2 border-red-500 bg-red-500/5"
                  : "text-gray-400 hover:text-gray-300 hover:bg-slate-700/30"
              }`}
            >
              {t("notifications")}
            </motion.button>
            {/* Safety tab */}
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleTabChange("safety")}
              className={`px-6 py-4 text-sm font-medium flex-1 transition-all duration-300 ${
                activeTab === "safety"
                  ? "text-red-400 border-b-2 border-red-500 bg-red-500/5"
                  : "text-gray-400 hover:text-gray-300 hover:bg-slate-700/30"
              }`}
            >
              {t("safety")}
            </motion.button>
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleTabChange("settings")}
              className={`px-6 py-4 text-sm font-medium flex-1 transition-all duration-300 ${
                activeTab === "settings"
                  ? "text-red-400 border-b-2 border-red-500 bg-red-500/5"
                  : "text-gray-400 hover:text-gray-300 hover:bg-slate-700/30"
              }`}
            >
              Settings
            </motion.button>
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleTabChange("about")}
              className={`px-6 py-4 text-sm font-medium flex-1 transition-all duration-300 ${
                activeTab === "about"
                  ? "text-red-400 border-b-2 border-red-500 bg-red-500/5"
                  : "text-gray-400 hover:text-gray-300 hover:bg-slate-700/30"
              }`}
            >
              About
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        {activeTab === "profile" && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: appSettings.lowMotion ? 0 : 0.3 }}
          >
            <motion.div
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: { y: 0, opacity: 1 },
              }}
              className="relative overflow-hidden bg-slate-800/60 border border-slate-700/50 shadow-2xl rounded-2xl backdrop-blur-sm mb-6"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-slate-700/20 to-transparent"></div>
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-500/20 p-3 rounded-xl border border-purple-500/30">
                      <Languages className="h-6 w-6 text-purple-400" />
                    </div>
                    <h3 className="font-bold text-white text-lg">{t("language")}</h3>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    {t("selectLanguage")}:
                  </h4>
                  <Select value={language} onValueChange={(value: Language) => setLanguage(value)}>
                    <SelectTrigger className="w-full bg-slate-700/40 border border-slate-600/50 text-white rounded-xl">
                      <SelectValue placeholder={t("selectLanguage")} />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border border-slate-600/50">
                      <SelectItem value="en" className="text-white hover:bg-slate-700">
                        🇬🇧 {t("english")}
                      </SelectItem>
                      <SelectItem value="kn" className="text-white hover:bg-slate-700">
                        🇮🇳 {t("kannada")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: { y: 0, opacity: 1 },
              }}
              className="relative overflow-hidden bg-slate-800/60 border border-slate-700/50 shadow-2xl rounded-2xl backdrop-blur-sm mb-6"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-slate-700/20 to-transparent"></div>
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-500/20 p-3 rounded-xl border border-blue-500/30">
                      <MapPin className="h-6 w-6 text-blue-400" />
                    </div>
                    <h3 className="font-bold text-white text-lg">{t("yourLocation")}</h3>
                  </div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-slate-600/50 text-slate-300 hover:bg-slate-700/50 rounded-xl bg-transparent"
                      onClick={getCurrentLocation}
                      disabled={locationLoading}
                    >
                      {locationLoading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        >
                          <Navigation className="h-4 w-4 mr-2" />
                        </motion.div>
                      ) : (
                        <Crosshair className="h-4 w-4 mr-2" />
                      )}
                      {locationLoading ? t("locating") : t("detectLocation")}
                    </Button>
                  </motion.div>
                </div>

                {currentLocation ? (
                  <div className="bg-slate-700/40 rounded-2xl p-4 border border-slate-600/30 mb-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-white font-medium">{t("locationDetected")}</span>
                    </div>
                    <p className="text-slate-300 text-sm mb-2">{currentLocation.address}</p>
                    <p className="text-slate-400 text-xs font-mono">
                      {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
                    </p>

                    {/* Map embed centered on current location */}
                    <div className="mt-4 rounded-xl overflow-hidden border border-slate-600/40 shadow-lg">
                      <div className="aspect-[16/9] w-full">
                        <iframe
                          title="Current Location Map"
                          className="w-full h-full"
                          src={`https://www.openstreetmap.org/export/embed.html?bbox=${(currentLocation.lng - 0.02).toFixed(6)}%2C${(currentLocation.lat - 0.02).toFixed(6)}%2C${(currentLocation.lng + 0.02).toFixed(6)}%2C${(currentLocation.lat + 0.02).toFixed(6)}&layer=mapnik&marker=${currentLocation.lat.toFixed(6)}%2C${currentLocation.lng.toFixed(6)}`}
                          style={{ border: 0 }}
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                        />
                      </div>
                      <div className="bg-slate-800/60 text-right p-2">
                        <a
                          className="text-xs text-blue-300 hover:text-blue-200 underline"
                          href={`https://www.openstreetmap.org/?mlat=${currentLocation.lat}&mlon=${currentLocation.lng}#map=14/${currentLocation.lat}/${currentLocation.lng}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Open in OpenStreetMap
                        </a>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-700/40 rounded-2xl p-4 border border-slate-600/30 text-center mb-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <span className="text-slate-300">{t("locationNotDetected")}</span>
                    </div>
                    <p className="text-slate-400 text-xs">{t("enableLocationAccess")}</p>
                  </div>
                )}

                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    {t("selectLocation Karnataka")}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {predefinedLocations.map((loc, index) => (
                      <motion.div key={index} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          variant="outline"
                          size="sm"
                          className={`justify-start border-slate-600/50 hover:bg-slate-700/50 transition-all duration-300 rounded-xl p-4 h-auto ${
                            selectedLocation.name === loc.name
                              ? "bg-slate-700/50 text-white border-red-500/50 shadow-lg shadow-red-500/10"
                              : "text-gray-300 hover:border-red-500/30"
                          }`}
                          onClick={() => selectLocation(loc)}
                        >
                          <MapPin className="h-4 w-4 mr-3 text-red-400" />
                          <div className="text-left">
                            <div className="font-medium">{loc.name.split(",")[0]}</div>
                            <div className="text-xs text-slate-400">{loc.name}</div>
                          </div>
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Emergency contacts */}
            <motion.div
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: { y: 0, opacity: 1 },
              }}
              className="mt-6 relative overflow-hidden bg-slate-800/60 border border-slate-700/50 shadow-2xl rounded-2xl backdrop-blur-sm"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-slate-700/20 to-transparent"></div>
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-red-500/20 p-3 rounded-xl border border-red-500/30">
                      <Phone className="h-6 w-6 text-red-400" />
                    </div>
                    <h3 className="font-bold text-white text-lg">{t("emergencyContacts")}</h3>
                  </div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-slate-600/50 text-slate-300 hover:bg-slate-700/50 rounded-xl bg-transparent"
                      onClick={() => setShowAddContact(!showAddContact)}
                    >
                      {showAddContact ? t("cancel") : t("addContact")}
                    </Button>
                  </motion.div>
                </div>

                <AnimatePresence>
                  {showAddContact && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-slate-700/50 rounded-2xl p-6 mb-6 border border-slate-600/50 backdrop-blur-sm"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <label className="text-xs text-slate-400 mb-2 block font-medium">{t("name")}</label>
                          <input
                            type="text"
                            value={newContact.name}
                            onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                            className="w-full bg-slate-800/50 border border-slate-600/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-300"
                            placeholder={t("contactName")}
                          />
                        </div>
                        <div>
                          <label className="text-xs text-slate-400 mb-2 block font-medium">{t("relation")}</label>
                          <input
                            type="text"
                            value={newContact.relation}
                            onChange={(e) => setNewContact({ ...newContact, relation: e.target.value })}
                            className="w-full bg-slate-800/50 border border-slate-600/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-300"
                            placeholder={t("relationOptional")}
                          />
                        </div>
                        <div>
                          <label className="text-xs text-slate-400 mb-2 block font-medium">{t("phoneNumber")}</label>
                          <input
                            type="text"
                            value={newContact.phone}
                            onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                            className="w-full bg-slate-800/50 border border-slate-600/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-300"
                            placeholder="+91 98765-43210"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            size="sm"
                            onClick={addEmergencyContact}
                            className="bg-red-600 hover:bg-red-700 rounded-xl"
                          >
                            {t("addContact")}
                          </Button>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-4">
                  {emergencyContacts.map((contact, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="bg-slate-700/40 rounded-2xl p-4 flex justify-between items-center border border-slate-600/30 hover:border-red-500/30 transition-all duration-300 backdrop-blur-sm"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-slate-600/50 p-3 rounded-xl">
                          <User className="h-5 w-5 text-slate-300" />
                        </div>
                        <div>
                          <div className="font-medium text-white text-lg">{contact.name}</div>
                          {contact.relation && <div className="text-sm text-slate-400">{contact.relation}</div>}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-slate-300 font-mono text-sm bg-slate-800/50 px-3 py-1 rounded-lg">
                          {contact.phone}
                        </div>
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-10 w-10 p-0 text-slate-400 hover:text-white hover:bg-slate-600/50 rounded-xl"
                            onClick={() => (window.location.href = `tel:${contact.phone}`)}
                          >
                            <Phone className="h-5 w-5" />
                          </Button>
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {activeTab === "notifications" && (
          <motion.div
            key="notifications"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: appSettings.lowMotion ? 0 : 0.3 }}
          >
            {/* ... existing notifications preferences and alert types ... */}
            <div className="bg-slate-700/40 rounded-2xl p-6 border border-slate-600/30 backdrop-blur-sm">
              <h4 className="font-medium text-white mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                {t("alertRadius")}
              </h4>
              {/* ... existing slider ... */}
              <div className="px-3">
                <Slider defaultValue={[50]} max={100} step={5} className="py-4" />
                <div className="flex justify-between text-xs text-slate-400 mt-2">
                  <span className="bg-slate-800/50 px-2 py-1 rounded">5 km</span>
                  <span className="bg-slate-700/50 px-2 py-1 rounded font-medium">50 km</span>
                  <span className="bg-slate-800/50 px-2 py-1 rounded">100 km</span>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-slate-700/40 rounded-2xl p-6 border border-slate-600/30 text-center">
              <div className="text-white font-semibold mb-1">No Notifications</div>
              <div className="text-slate-400 text-sm">You're all caught up. New notifications will appear here.</div>
            </div>
          </motion.div>
        )}

        {activeTab === "safety" && (
          <motion.div
            key="safety"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: appSettings.lowMotion ? 0 : 0.3 }}
          >
            {/* ... existing emergency information cards ... */}
            <motion.div
              className="bg-slate-700/40 rounded-2xl p-6 border border-slate-600/30 backdrop-blur-sm"
              whileHover={appSettings.lowMotion ? undefined : { scale: 1.02 }}
            >
              <h4 className="font-medium text-white mb-4 flex items-center gap-3">
                <User className="h-5 w-5 text-cyan-400" />
                {t("personalInformation")}
              </h4>
              <div className="space-y-4 text-gray-300">
                <div className="flex justify-between items-center p-2 bg-slate-800/30 rounded-lg">
                  <span className="text-slate-400">{t("fullName")}:</span>
                  <span className="font-medium text-white">Gautham Bekal</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-slate-800/30 rounded-lg">
                  <span className="text-slate-400">City:</span>
                  <span className="font-medium text-white">{selectedLocation.name.split(",")[0]}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-slate-800/30 rounded-lg">
                  <span className="text-slate-400">{t("age")}:</span>
                  <span className="font-medium text-white">32</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-slate-800/30 rounded-lg">
                  <span className="text-slate-400">{t("bloodType")}:</span>
                  <span className="font-medium text-white">B+</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-slate-800/30 rounded-lg">
                  <span className="text-slate-400">{t("height")}:</span>
                  <span className="font-medium text-white">175 cm</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-slate-800/30 rounded-lg">
                  <span className="text-slate-400">{t("weight")}:</span>
                  <span className="font-medium text-white">75 kg</span>
                </div>
              </div>
            </motion.div>
            {/* ... existing medical info, evacuation plan, emergency kit ... */}
            <motion.div
              className="bg-slate-700/40 rounded-2xl p-6 border border-slate-600/30 backdrop-blur-sm"
              whileHover={appSettings.lowMotion ? undefined : { scale: 1.02 }}
            >
              <h4 className="font-medium text-white mb-4 flex items-center gap-3">
                <Briefcase className="h-5 w-5 text-amber-400" />
                {t("emergencyKit")}
              </h4>
              <div className="space-y-4 text-gray-300">
                <div className="flex items-center justify-between p-2 bg-slate-800/30 rounded-lg">
                  <span className="flex items-center gap-3">
                    <motion.div
                      className="w-3 h-3 bg-green-500 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    ></motion.div>
                    <span>{t("firstAidKit")}</span>
                  </span>
                  <span className="text-green-400 font-medium">{t("available")}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-800/30 rounded-lg">
                  <span className="flex items-center gap-3">
                    <motion.div
                      className="w-3 h-3 bg-green-500 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
                    ></motion.div>
                    <span>{t("drinkingWater")}</span>
                  </span>
                  <span className="text-green-400 font-medium">{t("available")}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-800/30 rounded-lg">
                  <span className="flex items-center gap-3">
                    <motion.div
                      className="w-3 h-3 bg-yellow-500 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
                    ></motion.div>
                    <span>{t("emergencyFood")}</span>
                  </span>
                  <span className="text-yellow-400 font-medium">{t("low")}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-800/30 rounded-lg">
                  <span className="flex items-center gap-3">
                    <motion.div
                      className="w-3 h-3 bg-red-500 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 1.5 }}
                    ></motion.div>
                    <span>{t("backupBattery")}</span>
                  </span>
                  <span className="text-red-400 font-medium">{t("missing")}</span>
                </div>
              </div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button className="w-full mt-8 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 border-none shadow-2xl text-white font-medium py-4 rounded-2xl">
                <FileText className="h-5 w-5 mr-3" />
                {t("downloadEmergencyPDF")}
              </Button>
            </motion.div>
          </motion.div>
        )}

        {activeTab === "settings" && (
          <motion.div
            key="settings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: appSettings.lowMotion ? 0 : 0.25 }}
            className="cv-auto"
          >
            {/* Notifications */}
            <div className="relative overflow-hidden bg-slate-800/60 border border-slate-700/50 rounded-2xl backdrop-blur-sm shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-700/20 to-transparent"></div>
              <div className="relative p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-lg">Notifications</h3>
                  <label className="inline-flex items-center gap-2 text-sm text-slate-300 select-none">
                    <input
                      type="checkbox"
                      checked={masterPush}
                      onChange={(e) => setMasterPush(e.target.checked)}
                      className="h-4 w-4 accent-red-500"
                    />
                    Enable Push Alerts
                  </label>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(["earthquake", "flood", "fire", "weather"] as const).map((k) => (
                    <button
                      key={k}
                      onClick={() => toggleNotification(k)}
                      className={`rounded-xl px-4 py-3 text-sm transition-all duration-200 border ${
                        notificationPreferences[k] && masterPush
                          ? "bg-red-500/15 border-red-500/40 text-white"
                          : "bg-slate-700/40 border-slate-600/50 text-slate-300 hover:bg-slate-700/60"
                      }`}
                    >
                      {k[0].toUpperCase() + k.slice(1)} Alerts
                    </button>
                  ))}
                </div>

                <div className="space-y-2">
                  <div className="text-sm text-slate-300 font-medium">Alert Sound</div>
                  <div className="flex gap-2">
                    {(["Default", "Loud", "Silent"] as const).map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setAlertSound(opt)}
                        className={`rounded-lg px-3 py-2 text-xs border transition ${
                          alertSound === opt
                            ? "border-red-500/60 text-white bg-red-500/15"
                            : "border-slate-600/50 text-slate-300 hover:bg-slate-700/50"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Appearance */}
            <div className="mt-6 relative overflow-hidden bg-slate-800/60 border border-slate-700/50 rounded-2xl backdrop-blur-sm shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-700/20 to-transparent"></div>
              <div className="relative p-6 space-y-6">
                <h3 className="font-bold text-white text-lg">Appearance</h3>

                <div className="space-y-2">
                  <div className="text-sm text-slate-300 font-medium">Theme</div>
                  <div className="flex gap-2">
                    {(["system", "light", "dark"] as const).map((tKey) => (
                      <button
                        key={tKey}
                        onClick={() => setThemeChoice(tKey)}
                        className={`rounded-lg px-3 py-2 text-xs border transition ${
                          themeChoice === tKey
                            ? "border-red-500/60 text-white bg-red-500/15"
                            : "border-slate-600/50 text-slate-300 hover:bg-slate-700/50"
                        }`}
                      >
                        {tKey === "system" ? "System" : tKey[0].toUpperCase() + tKey.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm text-slate-300 font-medium">Text Size</div>
                  <input
                    type="range"
                    min={85}
                    max={125}
                    step={5}
                    value={textSize}
                    onChange={(e) => setTextSize(Number(e.target.value))}
                    className="w-full accent-red-500"
                  />
                  <div className="text-xs text-slate-400">Current: {textSize}%</div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label className="flex items-center justify-between rounded-xl px-4 py-3 bg-slate-700/40 border border-slate-600/50 text-slate-300">
                    <span>Location Services</span>
                    <input
                      type="checkbox"
                      checked={appSettings.locationServices}
                      onChange={() => toggleAppSetting("locationServices")}
                      className="h-4 w-4 accent-red-500"
                    />
                  </label>
                  <label className="flex items-center justify-between rounded-xl px-4 py-3 bg-slate-700/40 border border-slate-600/50 text-slate-300">
                    <span>Data Saver (Low Motion)</span>
                    <input
                      type="checkbox"
                      checked={appSettings.lowMotion}
                      onChange={() => toggleAppSetting("lowMotion")}
                      className="h-4 w-4 accent-red-500"
                    />
                  </label>
                  <label className="flex items-center justify-between rounded-xl px-4 py-3 bg-slate-700/40 border border-slate-600/50 text-slate-300">
                    <span>Haptic Feedback</span>
                    <input
                      type="checkbox"
                      checked={appSettings.haptics}
                      onChange={() => toggleAppSetting("haptics")}
                      className="h-4 w-4 accent-red-500"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Account & Security */}
            <div className="mt-6 relative overflow-hidden bg-slate-800/60 border border-slate-700/50 rounded-2xl backdrop-blur-sm shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-700/20 to-transparent"></div>
              <div className="relative p-6 space-y-3">
                <h3 className="font-bold text-white text-lg">Account & Security</h3>
                <button className="flex items-center justify-between w-full rounded-xl px-4 py-3 bg-slate-700/40 border border-slate-600/50 text-slate-200">
                  <span>Manage Account</span>
                  <span className="text-slate-400">›</span>
                </button>
                <button className="flex items-center justify-between w-full rounded-xl px-4 py-3 bg-slate-700/40 border border-slate-600/50 text-slate-200">
                  <span>Change Password</span>
                  <span className="text-slate-400">›</span>
                </button>
                <button className="mt-2 w-full rounded-xl px-4 py-3 bg-red-600/90 hover:bg-red-700 text-white font-medium">
                  Log Out
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "about" && (
          <motion.div
            key="about"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: appSettings.lowMotion ? 0 : 0.25 }}
            className="cv-auto"
          >
            <div className="relative overflow-hidden bg-slate-800/60 border border-slate-700/50 rounded-2xl backdrop-blur-sm shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-700/20 to-transparent"></div>
              <div className="relative p-6 space-y-4">
                <h3 className="font-bold text-white text-lg">About the App</h3>
                <p className="text-slate-300 text-sm">
                  This app provides near real-time disaster intelligence for Karnataka with AI-enhanced summaries for
                  weather, floods, earthquakes, and fires. Data sources include official agencies and AccuWeather.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="rounded-xl px-4 py-3 bg-slate-700/40 border border-slate-600/50">
                    <div className="text-slate-400 text-xs">Version</div>
                    <div className="text-white font-medium">v1.0.0</div>
                  </div>
                  <div className="rounded-xl px-4 py-3 bg-slate-700/40 border border-slate-600/50">
                    <div className="text-slate-400 text-xs">Last Updated</div>
                    <div className="text-white font-medium">{new Date().toLocaleString()}</div>
                  </div>
                  <a
                    href="https://www.accuweather.com/en/in/national/satellite#google_vignette"
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl px-4 py-3 bg-slate-700/40 border border-slate-600/50 hover:bg-slate-700/60 text-left"
                  >
                    <div className="text-slate-400 text-xs">Data Source</div>
                    <div className="text-white font-medium">AccuWeather Satellite</div>
                  </a>
                  <a
                    href="https://vercel.com/help"
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl px-4 py-3 bg-slate-700/40 border border-slate-600/50 hover:bg-slate-700/60 text-left"
                  >
                    <div className="text-slate-400 text-xs">Support</div>
                    <div className="text-white font-medium">Help Center</div>
                  </a>
                </div>

                <div className="divide-y divide-slate-700/50 rounded-xl overflow-hidden border border-slate-700/50">
                  <a className="flex items-center justify-between px-4 py-3 bg-slate-800/60 hover:bg-slate-700/60 text-slate-200">
                    <span>FAQ</span>
                    <span className="text-slate-400">›</span>
                  </a>
                  <a className="flex items-center justify-between px-4 py-3 bg-slate-800/60 hover:bg-slate-700/60 text-slate-200">
                    <span>Send Feedback</span>
                    <span className="text-slate-400">›</span>
                  </a>
                  <a className="flex items-center justify-between px-4 py-3 bg-slate-800/60 hover:bg-slate-700/60 text-slate-200">
                    <span>Rate this App</span>
                    <span className="text-slate-400">›</span>
                  </a>
                  <a className="flex items-center justify-between px-4 py-3 bg-slate-800/60 hover:bg-slate-700/60 text-slate-200">
                    <span>Privacy Policy</span>
                    <span className="text-slate-400">›</span>
                  </a>
                  <a className="flex items-center justify-between px-4 py-3 bg-slate-800/60 hover:bg-slate-700/60 text-slate-200">
                    <span>Terms of Service</span>
                    <span className="text-slate-400">›</span>
                  </a>
                  <a className="flex items-center justify-between px-4 py-3 bg-slate-800/60 hover:bg-slate-700/60 text-slate-200">
                    <span>Open Source Licenses</span>
                    <span className="text-slate-400">›</span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
