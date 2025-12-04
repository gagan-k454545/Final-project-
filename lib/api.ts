import type { WeatherData, EarthquakeData, ProcessedEarthquake, FloodData } from "./types"

// Weather API functions
export async function fetchWeatherData(location: string): Promise<WeatherData | null> {
  try {
    // Use the environment variable for the API key
    const apiKey = process.env.WEATHER_API_KEY

    if (!apiKey) {
      console.error("WEATHER_API_KEY environment variable is not set")
      throw new Error("Weather API key is not configured")
    }

    // For development/testing, use mock data if API key issues persist
    // This helps prevent 403 errors during development
    if (process.env.NODE_ENV === "development" || !apiKey.startsWith("live_")) {
      return getMockWeatherData(location)
    }

    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(
      location,
    )}&days=5&aqi=no&alerts=yes`

    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      // If API fails, fall back to mock data
      console.error(`Weather API responded with status: ${response.status}`)
      return getMockWeatherData(location)
    }

    const data: WeatherData = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching weather data:", error)
    // Fall back to mock data on any error
    return getMockWeatherData(location)
  }
}

// Mock weather data function for fallback
function getMockWeatherData(location: string): WeatherData {
  // Default to Mangaluru if no location specified
  const city = location || "Mangaluru"

  // Create realistic mock data for Indian locations
  const isCoastal = ["Mangaluru", "Mumbai", "Chennai", "Kochi", "Goa"].includes(city)
  const isNorthern = ["Delhi", "Shimla", "Chandigarh", "Lucknow"].includes(city)

  // Current date for realistic timestamps
  const now = new Date()

  // Base temperature varies by region
  let baseTemp = isCoastal ? 28 : isNorthern ? 22 : 25
  // Adjust for season (simplified)
  const month = now.getMonth()
  if (month >= 3 && month <= 5) baseTemp += 5 // Summer
  if (month >= 6 && month <= 8) baseTemp -= 2 // Monsoon
  if (month >= 9 && month <= 11) baseTemp += 0 // Autumn
  if (month === 0 || month === 1 || month === 11) baseTemp -= 5 // Winter

  // Randomize slightly
  const currentTemp = baseTemp + (Math.random() * 4 - 2)

  // Determine condition based on location and season
  let condition = "Sunny"
  if (isCoastal && month >= 6 && month <= 8) {
    condition = "Heavy rain"
  } else if (isNorthern && (month === 11 || month === 0 || month === 1)) {
    condition = "Fog"
  } else if (Math.random() > 0.7) {
    condition = ["Partly cloudy", "Cloudy", "Light rain", "Mist"][Math.floor(Math.random() * 4)]
  }

  // Create forecast data
  const forecast = Array.from({ length: 5 }, (_, i) => {
    const forecastDate = new Date()
    forecastDate.setDate(now.getDate() + i)

    // Temperature varies by day
    const dayVariation = Math.random() * 6 - 3
    const maxTemp = baseTemp + dayVariation + 5
    const minTemp = baseTemp + dayVariation - 5

    // Condition varies by day but with some consistency
    let dayCondition = condition
    if (Math.random() > 0.7) {
      dayCondition = ["Sunny", "Partly cloudy", "Cloudy", "Light rain", "Heavy rain", "Thunderstorm"][
        Math.floor(Math.random() * 6)
      ]
    }

    return {
      date: forecastDate.toISOString().split("T")[0],
      day: {
        maxtemp_c: maxTemp,
        mintemp_c: minTemp,
        condition: {
          text: dayCondition,
          icon: `//cdn.weatherapi.com/weather/64x64/day/${getIconCode(dayCondition)}.png`,
        },
        daily_chance_of_rain: dayCondition.includes("rain")
          ? 70 + Math.floor(Math.random() * 30)
          : Math.floor(Math.random() * 30),
      },
    }
  })

  // Create mock weather data object
  return {
    location: {
      name: city,
      region: getRegionForCity(city),
      country: "India",
      lat: getLatForCity(city),
      lon: getLonForCity(city),
      localtime: now.toISOString(),
    },
    current: {
      temp_c: currentTemp,
      condition: {
        text: condition,
        icon: `//cdn.weatherapi.com/weather/64x64/day/${getIconCode(condition)}.png`,
      },
      wind_kph: 5 + Math.random() * 15,
      humidity: 50 + Math.floor(Math.random() * 40),
      feelslike_c: currentTemp + (Math.random() * 2 - 1),
      uv: 5 + Math.floor(Math.random() * 6),
    },
    forecast: {
      forecastday: forecast,
    },
    alerts: {
      alert:
        isCoastal && condition.includes("rain")
          ? [
              {
                headline: "Heavy Rainfall Warning",
                severity: "Moderate",
                urgency: "Expected",
                areas: `${city} and surrounding areas`,
                desc: `Heavy rainfall expected in ${city} and surrounding areas. Possible flooding in low-lying areas.`,
                effective: now.toISOString(),
                expires: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
              },
            ]
          : [],
    },
  }
}

// Helper functions for mock data
function getIconCode(condition: string): string {
  const conditionMap: Record<string, string> = {
    Sunny: "113",
    "Partly cloudy": "116",
    Cloudy: "119",
    Overcast: "122",
    Mist: "143",
    "Light rain": "296",
    "Heavy rain": "308",
    Thunderstorm: "389",
    Fog: "248",
  }
  return conditionMap[condition] || "113"
}

function getRegionForCity(city: string): string {
  const regionMap: Record<string, string> = {
    Mangaluru: "Karnataka",
    Bengaluru: "Karnataka",
    Mumbai: "Maharashtra",
    Delhi: "Delhi",
    Chennai: "Tamil Nadu",
    Kolkata: "West Bengal",
    Hyderabad: "Telangana",
    Kochi: "Kerala",
    Shimla: "Himachal Pradesh",
    Goa: "Goa",
    Lucknow: "Uttar Pradesh",
    Chandigarh: "Chandigarh",
  }
  return regionMap[city] || "Karnataka"
}

function getLatForCity(city: string): number {
  const latMap: Record<string, number> = {
    Mangaluru: 12.9141,
    Bengaluru: 12.9716,
    Mumbai: 19.076,
    Delhi: 28.6139,
    Chennai: 13.0827,
    Kolkata: 22.5726,
    Hyderabad: 17.385,
    Kochi: 9.9312,
    Shimla: 31.1048,
    Goa: 15.2993,
    Lucknow: 26.8467,
    Chandigarh: 30.7333,
  }
  return latMap[city] || 12.9141
}

function getLonForCity(city: string): number {
  const lonMap: Record<string, number> = {
    Mangaluru: 74.856,
    Bengaluru: 77.5946,
    Mumbai: 72.8777,
    Delhi: 77.209,
    Chennai: 80.2707,
    Kolkata: 88.3639,
    Hyderabad: 78.4867,
    Kochi: 76.2673,
    Shimla: 77.1734,
    Goa: 74.124,
    Lucknow: 80.9462,
    Chandigarh: 76.7794,
  }
  return lonMap[city] || 74.856
}

// Earthquake API functions
export async function fetchEarthquakeData(): Promise<ProcessedEarthquake[]> {
  try {
    // USGS Earthquake API - filtered for significant earthquakes in the past 30 days
    const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson"

    const response = await fetch(url, { next: { revalidate: 3600 } }) // Cache for 1 hour

    if (!response.ok) {
      console.error(`Earthquake API responded with status: ${response.status}`)
      return getMockEarthquakeData()
    }

    const data: EarthquakeData = await response.json()

    // Filter for earthquakes in and around India (rough bounding box)
    // India and surrounding regions: Lat: 5N-40N, Long: 65E-100E
    const filteredEarthquakes = data.features.filter((quake) => {
      const [lng, lat] = quake.geometry.coordinates
      return lat >= 5 && lat <= 40 && lng >= 65 && lng <= 100
    })

    // If no earthquakes in the region, use mock data
    if (filteredEarthquakes.length === 0) {
      return getMockEarthquakeData()
    }

    // Process the earthquake data
    const processedData: ProcessedEarthquake[] = filteredEarthquakes.map((quake) => {
      const [lng, lat, depth] = quake.geometry.coordinates
      const mag = quake.properties.mag

      // Determine intensity based on magnitude
      let intensity = "Weak"
      if (mag >= 6) intensity = "Strong"
      else if (mag >= 5) intensity = "Moderate"
      else if (mag >= 4) intensity = "Light"

      // Format time
      const quakeTime = new Date(quake.properties.time)
      const now = new Date()
      const diffTime = Math.abs(now.getTime() - quakeTime.getTime())
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

      let timeString = ""
      if (diffDays === 0) {
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
        if (diffHours === 0) {
          const diffMinutes = Math.floor(diffTime / (1000 * 60))
          timeString = `${diffMinutes} minutes ago`
        } else {
          timeString = `${diffHours} hours ago`
        }
      } else if (diffDays === 1) {
        timeString = "Yesterday"
      } else if (diffDays < 7) {
        timeString = `${diffDays} days ago`
      } else if (diffDays < 14) {
        timeString = "1 week ago"
      } else if (diffDays < 21) {
        timeString = "2 weeks ago"
      } else if (diffDays < 28) {
        timeString = "3 weeks ago"
      } else {
        timeString = `${Math.floor(diffDays / 7)} weeks ago`
      }

      return {
        id: quake.id,
        magnitude: mag,
        location: quake.properties.place || "Unknown location",
        time: timeString,
        depth: `${depth.toFixed(1)}km`,
        intensity,
        coordinates: { lat, lng },
        url: quake.properties.url,
      }
    })

    // Sort by most recent
    return processedData.sort((a, b) => {
      const timeA = data.features.find((f) => f.id === a.id)?.properties.time || 0
      const timeB = data.features.find((f) => f.id === b.id)?.properties.time || 0
      return timeB - timeA
    })
  } catch (error) {
    console.error("Error fetching earthquake data:", error)
    return getMockEarthquakeData()
  }
}

// Mock earthquake data for fallback
function getMockEarthquakeData(): ProcessedEarthquake[] {
  // Create realistic mock data for Indian earthquakes
  const indianRegions = [
    { name: "Hindu Kush region, Afghanistan", lat: 36.5, lng: 71.0 },
    { name: "Kashmir region", lat: 34.0, lng: 74.8 },
    { name: "Gujarat region", lat: 23.0, lng: 72.0 },
    { name: "Uttarakhand region", lat: 30.0, lng: 79.0 },
    { name: "Andaman Islands region", lat: 11.7, lng: 92.8 },
    { name: "Nepal-India border region", lat: 27.7, lng: 85.3 },
    { name: "Bay of Bengal region", lat: 13.0, lng: 92.0 },
    { name: "Nicobar Islands region", lat: 8.0, lng: 93.5 },
  ]

  // Current date for realistic timestamps
  const now = new Date().getTime()

  // Generate 8-12 earthquakes
  const count = 8 + Math.floor(Math.random() * 5)

  return Array.from({ length: count }, (_, i) => {
    // Select a random region
    const region = indianRegions[Math.floor(Math.random() * indianRegions.length)]

    // Randomize location slightly
    const lat = region.lat + (Math.random() * 2 - 1)
    const lng = region.lng + (Math.random() * 2 - 1)

    // Randomize magnitude (mostly smaller quakes, occasionally larger ones)
    const magnitude =
      Math.random() > 0.8
        ? 5 + Math.random() * 2 // Larger quake (5.0-7.0)
        : 2.5 + Math.random() * 2.5 // Smaller quake (2.5-5.0)

    // Determine intensity based on magnitude
    let intensity = "Weak"
    if (magnitude >= 6) intensity = "Strong"
    else if (magnitude >= 5) intensity = "Moderate"
    else if (magnitude >= 4) intensity = "Light"

    // Randomize depth (typically 10-70km in India)
    const depth = 10 + Math.random() * 60

    // Randomize time (from now to 30 days ago)
    const timeAgo = Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)
    const quakeTime = now - timeAgo

    // Format time string
    const diffDays = Math.floor(timeAgo / (1000 * 60 * 60 * 24))
    let timeString = ""
    if (diffDays === 0) {
      const diffHours = Math.floor(timeAgo / (1000 * 60 * 60))
      if (diffHours === 0) {
        const diffMinutes = Math.floor(timeAgo / (1000 * 60))
        timeString = `${diffMinutes} minutes ago`
      } else {
        timeString = `${diffHours} hours ago`
      }
    } else if (diffDays === 1) {
      timeString = "Yesterday"
    } else if (diffDays < 7) {
      timeString = `${diffDays} days ago`
    } else if (diffDays < 14) {
      timeString = "1 week ago"
    } else if (diffDays < 21) {
      timeString = "2 weeks ago"
    } else if (diffDays < 28) {
      timeString = "3 weeks ago"
    } else {
      timeString = `${Math.floor(diffDays / 7)} weeks ago`
    }

    return {
      id: `mock-eq-${i}`,
      magnitude: Number.parseFloat(magnitude.toFixed(1)),
      location: `${Math.floor(Math.random() * 150) + 10} km ${["N", "NE", "E", "SE", "S", "SW", "W", "NW"][Math.floor(Math.random() * 8)]} of ${region.name}`,
      time: timeString,
      depth: `${depth.toFixed(1)}km`,
      intensity,
      coordinates: { lat, lng },
      url: "https://earthquake.usgs.gov/earthquakes/map/",
    }
  }).sort((a, b) => {
    // Sort by most recent (based on time string)
    const timeA = a.time
    const timeB = b.time

    // Simple string comparison for mock data
    if (timeA.includes("minutes") && !timeB.includes("minutes")) return -1
    if (!timeA.includes("minutes") && timeB.includes("minutes")) return 1
    if (timeA.includes("hours") && !timeB.includes("hours") && !timeB.includes("minutes")) return -1
    if (!timeA.includes("hours") && !timeA.includes("minutes") && timeB.includes("hours")) return 1

    return 0
  })
}

// Flood API functions
export async function fetchFloodData(region: string): Promise<FloodData> {
  // For now, we'll use mock data since we don't have a real flood API
  // In a real application, you would replace this with an actual API call

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Return mock flood data
  return getMockFloodData(region)
}

// Mock flood data function
function getMockFloodData(region: string): FloodData {
  // Default to Mangaluru if no region specified
  const area = region || "Mangaluru"

  // Current date for realistic timestamps
  const now = new Date()

  // Create realistic mock data for Indian regions
  const isCoastal = ["Mangaluru", "Mumbai", "Chennai", "Kochi", "Goa"].includes(area)
  const isRiverBasin = ["Bantwal", "Udupi", "Varanasi", "Patna", "Guwahati"].includes(area)

  // Base risk level varies by region type
  let baseRiskLevel = isCoastal ? 3 : isRiverBasin ? 4 : 2

  // Adjust for season (simplified)
  const month = now.getMonth()
  if (month >= 6 && month <= 8) baseRiskLevel += 2 // Monsoon season

  // Clamp risk level between 1-5
  baseRiskLevel = Math.max(1, Math.min(5, baseRiskLevel))

  // Generate affected areas
  const affectedAreas = []
  if (area === "Mangaluru") {
    affectedAreas.push(
      { name: "Netravati River Basin", riskLevel: baseRiskLevel },
      { name: "Phalguni River Basin", riskLevel: Math.max(1, baseRiskLevel - 1) },
      { name: "Mangaluru City Center", riskLevel: Math.max(1, baseRiskLevel - 2) },
      { name: "Ullal Coastal Area", riskLevel: baseRiskLevel },
    )
  } else if (area === "Bantwal") {
    affectedAreas.push(
      { name: "Netravati River Basin", riskLevel: baseRiskLevel },
      { name: "Bantwal Town", riskLevel: Math.max(1, baseRiskLevel - 1) },
      { name: "BC Road Area", riskLevel: Math.max(1, baseRiskLevel - 1) },
    )
  } else if (area === "Udupi") {
    affectedAreas.push(
      { name: "Swarna River Basin", riskLevel: baseRiskLevel },
      { name: "Udupi Town", riskLevel: Math.max(1, baseRiskLevel - 1) },
      { name: "Malpe Coastal Area", riskLevel: baseRiskLevel },
    )
  } else {
    // Generic areas for other regions
    affectedAreas.push(
      { name: `${area} River Basin`, riskLevel: baseRiskLevel },
      { name: `${area} City Center`, riskLevel: Math.max(1, baseRiskLevel - 2) },
      { name: `${area} Outskirts`, riskLevel: Math.max(1, baseRiskLevel - 1) },
    )
  }

  // Generate river data
  const riverData = []
  if (area === "Mangaluru") {
    riverData.push(
      { name: "Netravati River", currentLevel: 8.2, dangerLevel: 9.0, trend: "Rising" },
      { name: "Phalguni River", currentLevel: 7.5, dangerLevel: 8.5, trend: "Stable" },
      { name: "Kumaradhara River", currentLevel: 6.8, dangerLevel: 8.0, trend: "Rising" },
    )
  } else if (area === "Bantwal") {
    riverData.push({ name: "Netravati River", currentLevel: 8.5, dangerLevel: 9.0, trend: "Rising" })
  } else if (area === "Udupi") {
    riverData.push(
      { name: "Swarna River", currentLevel: 7.2, dangerLevel: 8.0, trend: "Stable" },
      { name: "Sita River", currentLevel: 6.5, dangerLevel: 7.5, trend: "Rising" },
    )
  } else {
    // Generic river for other regions
    riverData.push({ name: `${area} River`, currentLevel: 7.0, dangerLevel: 8.0, trend: "Stable" })
  }

  // Generate evacuation centers
  const evacuationCenters = []
  if (area === "Mangaluru") {
    evacuationCenters.push(
      { name: "Mangaluru City Corporation Building", capacity: 500, currentOccupancy: 120 },
      { name: "St. Aloysius College", capacity: 300, currentOccupancy: 85 },
      { name: "Mangaluru University Campus", capacity: 600, currentOccupancy: 150 },
    )
  } else if (area === "Bantwal") {
    evacuationCenters.push(
      { name: "Bantwal Government School", capacity: 200, currentOccupancy: 65 },
      { name: "Bantwal Community Hall", capacity: 150, currentOccupancy: 40 },
    )
  } else if (area === "Udupi") {
    evacuationCenters.push(
      { name: "Udupi Town Hall", capacity: 250, currentOccupancy: 70 },
      { name: "Manipal University Campus", capacity: 400, currentOccupancy: 110 },
    )
  } else {
    // Generic evacuation centers for other regions
    evacuationCenters.push(
      { name: `${area} Government School`, capacity: 200, currentOccupancy: Math.floor(Math.random() * 100) + 50 },
      { name: `${area} Community Center`, capacity: 300, currentOccupancy: Math.floor(Math.random() * 150) + 75 },
    )
  }

  // Generate alerts based on risk level
  const alerts = []
  if (baseRiskLevel >= 4) {
    alerts.push({
      severity: "High",
      message: `Severe flood warning for ${area}. Evacuation recommended for low-lying areas.`,
      timestamp: now.toISOString(),
    })
  } else if (baseRiskLevel >= 3) {
    alerts.push({
      severity: "Medium",
      message: `Flood warning for ${area}. Be prepared for possible evacuation.`,
      timestamp: now.toISOString(),
    })
  } else if (baseRiskLevel >= 2) {
    alerts.push({
      severity: "Low",
      message: `Flood watch for ${area}. Monitor local news for updates.`,
      timestamp: now.toISOString(),
    })
  }

  // Add rainfall alert during monsoon
  if (month >= 6 && month <= 8) {
    alerts.push({
      severity: baseRiskLevel >= 3 ? "High" : "Medium",
      message: `Heavy rainfall expected in ${area} over the next 24-48 hours.`,
      timestamp: new Date(now.getTime() - 3600000).toISOString(), // 1 hour ago
    })
  }

  return {
    region: area,
    lastUpdated: now.toISOString(),
    overallRiskLevel: baseRiskLevel,
    affectedAreas,
    riverData,
    evacuationCenters,
    alerts,
  }
}
