import { NextResponse } from "next/server"

// This is a simulated API endpoint for flood data
// In a real application, this would connect to a real-time flood monitoring API

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const region = searchParams.get("region") || "mangaluru"

  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Simulated flood data for different regions
    const floodData = {
      mangaluru: {
        riskLevel: "High",
        currentStatus: "Active Flooding",
        affectedAreas: [
          { id: 1, name: "Mangaluru City", risk: "High", evacuationOrder: true },
          { id: 2, name: "Bantwal, Karnataka", risk: "High", evacuationOrder: true },
          { id: 3, name: "Ullal", risk: "High", evacuationOrder: true },
          { id: 4, name: "Mulki", risk: "Moderate", evacuationOrder: false },
          { id: 5, name: "Surathkal", risk: "Moderate", evacuationOrder: false },
        ],
        waterLevels: [
          { id: 1, location: "Netravati River", level: "15.2m", status: "Rising", rate: "+0.5m/hr" },
          { id: 2, location: "Phalguni River", level: "9.8m", status: "Rising", rate: "+0.3m/hr" },
          { id: 3, location: "Kumaradhara River", level: "12.7m", status: "Stable", rate: "0m/hr" },
        ],
        evacuationCenters: [
          { name: "Mangaluru Town Hall", capacity: "250 people", occupancy: "180 people", status: "Open" },
          { name: "Bantwal Government School", capacity: "150 people", occupancy: "120 people", status: "Open" },
          { name: "Ullal Community Center", capacity: "100 people", occupancy: "85 people", status: "Open" },
        ],
        alerts: [
          {
            title: "Red Alert: Heavy Rainfall",
            message:
              "Extremely heavy rainfall expected in coastal Karnataka. Residents in low-lying areas advised to evacuate immediately.",
            time: new Date(Date.now() - 3 * 60 * 60 * 1000),
          },
          {
            title: "Netravati River Overflow Warning",
            message: "Netravati river has crossed danger mark. Areas along the riverbank at high risk of flooding.",
            time: new Date(Date.now() - 5 * 60 * 60 * 1000),
          },
        ],
      },
      udupi: {
        riskLevel: "Moderate",
        currentStatus: "Flood Warning",
        affectedAreas: [
          { id: 1, name: "Udupi City", risk: "Moderate", evacuationOrder: false },
          { id: 2, name: "Manipal", risk: "Moderate", evacuationOrder: false },
          { id: 3, name: "Karkala", risk: "Low", evacuationOrder: false },
          { id: 4, name: "Kundapur", risk: "Moderate", evacuationOrder: false },
        ],
        waterLevels: [
          { id: 1, location: "Swarna River", level: "7.8m", status: "Rising", rate: "+0.2m/hr" },
          { id: 2, location: "Sita River", level: "6.5m", status: "Stable", rate: "0m/hr" },
        ],
        evacuationCenters: [
          { name: "Udupi District School", capacity: "200 people", occupancy: "85 people", status: "Open" },
          { name: "Manipal Community Hall", capacity: "150 people", occupancy: "60 people", status: "Open" },
        ],
        alerts: [
          {
            title: "Orange Alert: Heavy Rainfall",
            message: "Heavy rainfall expected in Udupi district. Residents in low-lying areas advised to stay alert.",
            time: new Date(Date.now() - 4 * 60 * 60 * 1000),
          },
        ],
      },
      bangalore: {
        riskLevel: "Low",
        currentStatus: "Normal",
        affectedAreas: [
          { id: 1, name: "Koramangala", risk: "Low", evacuationOrder: false },
          { id: 2, name: "Bellandur", risk: "Low", evacuationOrder: false },
          { id: 3, name: "Varthur", risk: "Low", evacuationOrder: false },
          { id: 4, name: "Whitefield", risk: "Low", evacuationOrder: false },
        ],
        waterLevels: [
          { id: 1, location: "Vrishabhavathi River", level: "4.2m", status: "Stable", rate: "0m/hr" },
          { id: 2, location: "Arkavathi River", level: "3.8m", status: "Stable", rate: "0m/hr" },
        ],
        evacuationCenters: [
          { name: "Koramangala Indoor Stadium", capacity: "300 people", occupancy: "0 people", status: "Standby" },
          { name: "Bellandur Government School", capacity: "200 people", occupancy: "0 people", status: "Standby" },
        ],
        alerts: [],
      },
    }

    const data = floodData[region as keyof typeof floodData] || floodData.mangaluru

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in flood API route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
