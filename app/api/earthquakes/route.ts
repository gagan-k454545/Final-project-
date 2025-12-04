import { NextResponse } from "next/server"
import { fetchEarthquakeData } from "@/lib/api"

export async function GET() {
  try {
    const earthquakeData = await fetchEarthquakeData()

    if (!earthquakeData || earthquakeData.length === 0) {
      return NextResponse.json({ error: "Failed to fetch earthquake data" }, { status: 500 })
    }

    return NextResponse.json(earthquakeData)
  } catch (error) {
    console.error("Error in earthquake API route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
