import { NextResponse } from "next/server"
import { fetchWeatherData } from "@/lib/api"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const location = searchParams.get("location") || "Mangaluru"

  try {
    const weatherData = await fetchWeatherData(location)

    if (!weatherData) {
      return NextResponse.json({ error: "Failed to fetch weather data" }, { status: 500 })
    }

    return NextResponse.json(weatherData)
  } catch (error) {
    console.error("Error in weather API route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
