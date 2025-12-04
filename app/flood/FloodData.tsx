"use client"

export const indianFloodData = {
  riskLevel: "High",
  affectedAreas: [
    { id: 1, name: "Mangaluru City", risk: "High", evacuationOrder: true },
    { id: 2, name: "Bantwal, Karnataka", risk: "High", evacuationOrder: true },
    { id: 3, name: "Udupi, Karnataka", risk: "Moderate", evacuationOrder: false },
    { id: 4, name: "Dakshina Kannada", risk: "Moderate", evacuationOrder: false },
    { id: 5, name: "Uttara Kannada", risk: "Low", evacuationOrder: false },
  ],
  waterLevels: [
    { id: 1, location: "Netravati River", level: "15.2m", status: "Rising", rate: "+0.5m/hr" },
    { id: 2, location: "Phalguni River", level: "9.8m", status: "Rising", rate: "+0.3m/hr" },
    { id: 3, location: "Kumaradhara River", level: "12.7m", status: "Stable", rate: "0m/hr" },
  ],
  safetyTips: [
    "Move to higher ground immediately if flooding occurs",
    "Avoid walking or driving through flood waters",
    "Stay away from power lines and electrical wires",
    "Be prepared to evacuate at a moment's notice",
    "Keep emergency supplies ready including drinking water and non-perishable food",
  ],
}
