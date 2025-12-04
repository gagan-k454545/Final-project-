import { NextResponse } from "next/server"

// Weather patterns specific to Mangaluru and Karnataka coastal region
const mangaluruPatterns = {
  monsoon: {
    months: [5, 6, 7, 8, 9], // June to September (0-indexed)
    rainfall: { min: 70, max: 95 },
    temperature: { min: 23, max: 30 },
    humidity: { min: 80, max: 95 },
    windSpeed: { min: 15, max: 30 },
    conditions: [
      "Heavy monsoon rainfall",
      "Thunderstorms",
      "Persistent rainfall",
      "Scattered heavy showers",
      "Moderate to heavy rainfall",
    ],
    alerts: [
      "Flash flood risk in low-lying areas",
      "Coastal erosion warning",
      "High tide alert",
      "Landslide risk in Western Ghats",
      "Urban flooding possible",
    ],
  },
  postMonsoon: {
    months: [10, 11], // October to November
    rainfall: { min: 30, max: 70 },
    temperature: { min: 24, max: 32 },
    humidity: { min: 70, max: 85 },
    windSpeed: { min: 8, max: 20 },
    conditions: [
      "Occasional showers",
      "Partly cloudy with scattered rain",
      "Decreasing rainfall",
      "Intermittent showers",
      "Clearing weather patterns",
    ],
    alerts: ["Isolated heavy rainfall possible", "Moderate flood risk", "Improving conditions expected"],
  },
  winter: {
    months: [0, 1, 2], // December to February
    rainfall: { min: 5, max: 30 },
    temperature: { min: 20, max: 33 },
    humidity: { min: 60, max: 80 },
    windSpeed: { min: 5, max: 15 },
    conditions: ["Clear skies", "Mild temperatures", "Occasional light showers", "Morning mist", "Pleasant weather"],
    alerts: [],
  },
  summer: {
    months: [3, 4], // March to May
    rainfall: { min: 10, max: 40 },
    temperature: { min: 25, max: 36 },
    humidity: { min: 65, max: 85 },
    windSpeed: { min: 8, max: 18 },
    conditions: [
      "Hot and humid",
      "Pre-monsoon showers",
      "Increasing humidity",
      "Warm with afternoon thunderstorms",
      "Building cloud cover",
    ],
    alerts: ["Heat advisory", "Pre-monsoon thunderstorm warning", "Prepare for upcoming monsoon season"],
  },
}

// Nearby locations in Karnataka
const nearbyLocations = [
  {
    name: "Mangaluru",
    region: "Dakshina Kannada",
    lat: 12.9141,
    lng: 74.856,
    elevation: 22, // meters
    coastal: true,
  },
  {
    name: "Udupi",
    region: "Udupi District",
    lat: 13.3409,
    lng: 74.7421,
    elevation: 39,
    coastal: true,
  },
  {
    name: "Bantwal",
    region: "Dakshina Kannada",
    lat: 12.8067,
    lng: 75.0336,
    elevation: 76,
    coastal: false,
  },
  {
    name: "Puttur",
    region: "Dakshina Kannada",
    lat: 12.7594,
    lng: 75.2219,
    elevation: 85,
    coastal: false,
  },
  {
    name: "Sullia",
    region: "Dakshina Kannada",
    lat: 12.5634,
    lng: 75.3869,
    elevation: 146,
    coastal: false,
  },
]

// AI model types we're "using"
const aiModels = [
  {
    name: "DeepWeather-CNN",
    description: "Convolutional Neural Network trained on 50 years of meteorological data",
    specialization: "Precipitation patterns and intensity",
    accuracy: 0.89,
  },
  {
    name: "AtmosLSTM",
    description: "Long Short-Term Memory network for temporal weather pattern analysis",
    specialization: "Temperature and humidity forecasting",
    accuracy: 0.92,
  },
  {
    name: "GeoTransformer",
    description: "Transformer-based model incorporating geographical and topographical features",
    specialization: "Region-specific weather events",
    accuracy: 0.87,
  },
  {
    name: "EnsembleClimate",
    description: "Ensemble model combining multiple prediction algorithms",
    specialization: "Overall weather pattern prediction",
    accuracy: 0.94,
  },
]

// Function to get current season based on month
function getCurrentSeason() {
  const currentMonth = new Date().getMonth()

  if (mangaluruPatterns.monsoon.months.includes(currentMonth)) return "monsoon"
  if (mangaluruPatterns.postMonsoon.months.includes(currentMonth)) return "postMonsoon"
  if (mangaluruPatterns.winter.months.includes(currentMonth)) return "winter"
  return "summer"
}

// Function to generate a random number within a range
function randomInRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Function to select a random item from an array
function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

// Function to generate AI prediction for a location
function generatePrediction(location: (typeof nearbyLocations)[0], daysAhead = 0) {
  const season = getCurrentSeason()
  const seasonData = mangaluruPatterns[season as keyof typeof mangaluruPatterns]

  // Adjust prediction based on location characteristics
  const elevationFactor = location.elevation / 100 // Higher elevation = cooler
  const coastalFactor = location.coastal ? 1 : 0.8 // Coastal areas get more rain

  // Calculate temperature range with some randomness
  const tempMin = Math.round(seasonData.temperature.min - elevationFactor * 2 + randomInRange(-1, 1))
  const tempMax = Math.round(seasonData.temperature.max - elevationFactor * 3 + randomInRange(-1, 2))

  // Calculate rainfall probability with some randomness
  const rainfallProb = Math.round(
    seasonData.rainfall.min +
      (seasonData.rainfall.max - seasonData.rainfall.min) * coastalFactor +
      randomInRange(-5, 5),
  )

  // Ensure rainfall probability is within bounds
  const rainfall = Math.max(0, Math.min(100, rainfallProb))

  // Select condition based on season and rainfall
  const condition = randomItem(seasonData.conditions)

  // Select alerts if applicable
  const alerts = seasonData.alerts.length > 0 && Math.random() > 0.6 ? [randomItem(seasonData.alerts)] : []

  // Calculate confidence level (higher for shorter predictions, lower for longer)
  const confidenceBase = randomInRange(85, 95)
  const confidence = Math.max(70, Math.round(confidenceBase - daysAhead * 3))

  // Select AI model that made this prediction
  const model = randomItem(aiModels)

  return {
    location: location.name,
    region: location.region,
    prediction: condition,
    confidence,
    temperature: { min: tempMin, max: tempMax },
    precipitation: rainfall,
    humidity: randomInRange(seasonData.humidity.min, seasonData.humidity.max),
    windSpeed: randomInRange(seasonData.windSpeed.min, seasonData.windSpeed.max),
    windDirection: randomItem(["NE", "E", "SE", "S", "SW", "W", "NW", "N"]),
    alerts,
    model,
    updated: new Date().toISOString(),
    forecastDate: new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000).toISOString(),
  }
}

export async function GET() {
  try {
    // Simulate AI model processing time
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Generate current predictions for all locations
    const currentPredictions = nearbyLocations.map((location) => generatePrediction(location, 0))

    // Generate 5-day forecast for Mangaluru
    const mangaluru = nearbyLocations.find((loc) => loc.name === "Mangaluru")
    const forecast = mangaluru ? Array.from({ length: 5 }, (_, i) => generatePrediction(mangaluru, i + 1)) : []

    // Generate model explanation
    const modelInsights = {
      primaryModel: randomItem(aiModels),
      dataPoints: randomInRange(15000, 25000),
      confidenceOverall: randomInRange(87, 94),
      lastTrained: new Date(Date.now() - randomInRange(1, 7) * 24 * 60 * 60 * 1000).toISOString(),
      keyFactors: [
        "Monsoon intensity patterns",
        "Arabian Sea temperature anomalies",
        "Western Ghats orographic effect",
        "El Niño-Southern Oscillation (ENSO) status",
        "Indian Ocean Dipole (IOD) phase",
      ],
    }

    return NextResponse.json({
      currentPredictions,
      forecast,
      modelInsights,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error generating AI weather predictions:", error)
    return NextResponse.json({ error: "Failed to generate AI weather predictions" }, { status: 500 })
  }
}
