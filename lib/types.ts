// Weather API types
export interface WeatherData {
  location: {
    name: string
    region: string
    country: string
    lat: number
    lon: number
    localtime: string
  }
  current: {
    temp_c: number
    condition: {
      text: string
      icon: string
    }
    wind_kph: number
    humidity: number
    feelslike_c: number
    uv: number
  }
  forecast: {
    forecastday: Array<{
      date: string
      day: {
        maxtemp_c: number
        mintemp_c: number
        condition: {
          text: string
          icon: string
        }
        daily_chance_of_rain: number
      }
    }>
  }
  alerts: {
    alert: Array<{
      headline: string
      severity: string
      urgency: string
      areas: string
      desc: string
      effective: string
      expires: string
    }>
  }
}

// Earthquake API types
export interface EarthquakeData {
  type: string
  metadata: {
    generated: number
    url: string
    title: string
    status: number
    api: string
    count: number
  }
  features: Array<{
    type: string
    properties: {
      mag: number
      place: string
      time: number
      updated: number
      tz: number
      url: string
      detail: string
      felt: number | null
      cdi: number | null
      mmi: number | null
      alert: string | null
      status: string
      tsunami: number
      sig: number
      net: string
      code: string
      ids: string
      sources: string
      types: string
      nst: number | null
      dmin: number | null
      rms: number
      gap: number | null
      magType: string
      type: string
      title: string
    }
    geometry: {
      type: string
      coordinates: [number, number, number] // [longitude, latitude, depth]
    }
    id: string
  }>
}

export interface ProcessedEarthquake {
  id: string
  magnitude: number
  location: string
  time: string
  depth: string
  intensity: string
  coordinates: {
    lat: number
    lng: number
  }
  url: string
}

// Flood API types
export interface FloodData {
  region: string
  lastUpdated: string
  overallRiskLevel: number // 1-5 scale
  affectedAreas: Array<{
    name: string
    riskLevel: number // 1-5 scale
  }>
  riverData: Array<{
    name: string
    currentLevel: number // in meters
    dangerLevel: number // in meters
    trend: string // "Rising", "Falling", "Stable"
  }>
  evacuationCenters: Array<{
    name: string
    capacity: number
    currentOccupancy: number
  }>
  alerts: Array<{
    severity: string // "Low", "Medium", "High"
    message: string
    timestamp: string
  }>
}
