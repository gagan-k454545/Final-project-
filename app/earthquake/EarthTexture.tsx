"use client"

import { useEffect, useState } from "react"
import * as THREE from "three"

export function useEarthTexture() {
  const [texture, setTexture] = useState<THREE.Texture | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const textureLoader = new THREE.TextureLoader()
    textureLoader.crossOrigin = "anonymous"

    textureLoader.load(
      "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg",
      (loadedTexture) => {
        setTexture(loadedTexture)
        setLoading(false)
      },
      undefined,
      (err) => {
        console.error("Error loading texture:", err)
        setError("Failed to load Earth texture")
        setLoading(false)
      },
    )
  }, [])

  return { texture, loading, error }
}
