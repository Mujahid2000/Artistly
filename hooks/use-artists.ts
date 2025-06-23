"use client"

import { useState, useEffect, useMemo } from "react"
import { useDebounce } from "./use-debounce"
import { FilterState } from "@/compomnents/artist-filters"
import { Artist } from "@/compomnents/artist-card"


interface UseArtistsProps {
  initialArtists: Artist[]
  searchQuery: string
  filters: FilterState
}

export function useArtists({ initialArtists, searchQuery, filters }: UseArtistsProps) {
  const [artists, setArtists] = useState<Artist[]>(initialArtists)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Debounce search query to avoid excessive filtering
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  // Filter artists based on search and filters
  const filteredArtists = useMemo(() => {
    return artists.filter((artist) => {
      // Search filter - search in name, category, and city
      const matchesSearch =
        !debouncedSearchQuery ||
        artist.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        artist.category.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        artist.city.toLowerCase().includes(debouncedSearchQuery.toLowerCase())

      // Category filter
      const matchesCategory = filters.categories.length === 0 || filters.categories.includes(artist.category)

      // Location filter - match against city
      const matchesLocation = filters.locations.length === 0 || filters.locations.includes(artist.city)

      // Price range filter - parse fee string (e.g., "$500-800" -> 500)
      const priceValue = Number.parseInt(artist.fee.split("-")[0].replace("$", ""))
      const matchesPrice = priceValue >= filters.priceRange[0] && priceValue <= filters.priceRange[1]

      return matchesSearch && matchesCategory && matchesLocation && matchesPrice
    })
  }, [artists, debouncedSearchQuery, filters])

  // Simulate API call when filters change
  useEffect(() => {
    const fetchArtists = async () => {
      setLoading(true)
      setError(null)

      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        // In a real app, you would make an API call here
        // const response = await fetch('/api/artists', { ... })
        // const data = await response.json()

        setArtists(initialArtists)
      } catch (err) {
        setError("Failed to fetch artists")
        console.error("Error fetching artists:", err)
      } finally {
        setLoading(false)
      }
    }

    // Only fetch if we have active filters or search
    if (debouncedSearchQuery || filters.categories.length > 0 || filters.locations.length > 0) {
      fetchArtists()
    } else {
      setArtists(initialArtists)
    }
  }, [debouncedSearchQuery, filters, initialArtists])

  return {
    artists: filteredArtists,
    loading,
    error,
    totalCount: artists.length,
    filteredCount: filteredArtists.length,
  }
}
