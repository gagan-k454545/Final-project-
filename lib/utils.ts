import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format date relative to current time (e.g., "2 hours ago", "Yesterday", etc.)
export function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffTime / (1000 * 60))
      return diffMinutes === 0 ? "Just now" : `${diffMinutes} minutes ago`
    }
    return `${diffHours} hours ago`
  } else if (diffDays === 1) {
    return "Yesterday"
  } else if (diffDays < 7) {
    return `${diffDays} days ago`
  } else if (diffDays < 14) {
    return "1 week ago"
  } else if (diffDays < 21) {
    return "2 weeks ago"
  } else if (diffDays < 28) {
    return "3 weeks ago"
  } else {
    return `${Math.floor(diffDays / 7)} weeks ago`
  }
}

// Format a number with a specific number of decimal places
export function formatNumber(num: number, decimals = 1): string {
  return num.toFixed(decimals)
}

// Convert latitude and longitude to 3D coordinates on a sphere
export function latLngToVector3(lat: number, lng: number, radius = 1.02): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)

  const x = -(radius * Math.sin(phi) * Math.cos(theta))
  const z = radius * Math.sin(phi) * Math.sin(theta)
  const y = radius * Math.cos(phi)

  return [x, y, z]
}

// Get color based on severity level
export function getSeverityColor(level: string): string {
  switch (level.toLowerCase()) {
    case "high":
    case "severe":
    case "strong":
    case "major":
      return "red"
    case "moderate":
    case "medium":
      return "orange"
    case "low":
    case "weak":
    case "minor":
      return "green"
    default:
      return "blue"
  }
}
