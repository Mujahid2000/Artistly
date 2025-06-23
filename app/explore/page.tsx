"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { useArtists } from "@/hooks/use-artists"
import { Search, Grid, List, Loader2 } from "lucide-react"
import artistsData from "@/data/artists.json"
import { FadeIn } from "@/compomnents/motion/fade-in"
import { SlideIn } from "@/compomnents/motion/slide-in"
import { ArtistFilters, FilterState } from "@/compomnents/artist-filters"

import { StaggerContainer } from "@/compomnents/motion/stagger-container"
import { StaggerItem } from "@/compomnents/motion/stagger-item"
import { Artist, ArtistCard } from "@/compomnents/artist-card"
import { AnimatedButton } from "@/compomnents/ui/animated-button"

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    locations: [],
    priceRange: [0, 10000],
  })

  // Use artists data which was from JSON file
  const { artists, loading, error, totalCount, filteredCount } = useArtists({
    initialArtists: artistsData as Artist[],
    searchQuery,
    filters,
  })

  const handleClearFilters = () => {
    setFilters({
      categories: [],
      locations: [],
      priceRange: [0, 10000],
    })
    setSearchQuery("")
  }

  // Handle URL parameters for category filtering
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const categoryParam = urlParams.get("category")

    if (categoryParam) {
      // Map URL category to JSON category format
      const categoryMap: { [key: string]: string } = {
        singers: "Singer",
        dancers: "Dancer",
        djs: "DJ",
        comedians: "Comedian",
        musicians: "Musician",
        magicians: "Magician",
        bands: "Band",
      }

      const mappedCategory = categoryMap[categoryParam.toLowerCase()]
      if (mappedCategory) {
        setFilters((prev) => ({
          ...prev,
          categories: [mappedCategory],
        }))
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <FadeIn className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Explore Artists</h1>
          <p className="text-lg text-gray-600">Discover talented performers for your next event</p>
        </FadeIn>

        {/* Search Bar */}
        <SlideIn direction="up" delay={0.2} className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search artists, categories, or locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </SlideIn>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <SlideIn direction="left" delay={0.3} className="lg:w-80 flex-shrink-0">
            <ArtistFilters filters={filters} onFiltersChange={setFilters} onClearFilters={handleClearFilters} />
          </SlideIn>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <FadeIn delay={0.4} className="flex items-center justify-between mb-6">
              <div>
                <p className="text-gray-600">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading artists...
                    </span>
                  ) : (
                    `Showing ${filteredCount} of ${totalCount} artists`
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <AnimatedButton
                  color={viewMode === "grid" ? "default" : "outline"}
                  
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="w-4 h-4" />
                </AnimatedButton>
                <AnimatedButton
                  color={viewMode === "list" ? "default" : "outline"}
                  
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </AnimatedButton>
              </div>
            </FadeIn>

            {/* Error State */}
            {error && (
              <FadeIn className="text-center py-12">
                <p className="text-red-500 text-lg mb-4">{error}</p>
                <AnimatedButton onClick={() => window.location.reload()} color="outline">
                  Try Again
                </AnimatedButton>
              </FadeIn>
            )}

            {/* Artists Grid */}
            {!error && artists.length > 0 ? (
              <StaggerContainer
                className={`grid gap-6 ${
                  viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
                }`}
                staggerDelay={0.1}
              >
                {artists.map((artist) => (
                  <StaggerItem key={artist.id}>
                    <ArtistCard artist={artist} />
                  </StaggerItem>
                ))}
              </StaggerContainer>
            ) : !loading && !error ? (
              <FadeIn className="text-center py-12">
                <p className="text-gray-500 text-lg mb-4">No artists found matching your criteria</p>
                <AnimatedButton onClick={handleClearFilters} color="outline">
                  Clear Filters
                </AnimatedButton>
              </FadeIn>
            ) : null}

            {/* Load More Button */}
            {/* {!loading && !error && artists.length > 0 && (
              <FadeIn delay={0.6} className="text-center mt-12">
                <AnimatedButton color="outline" >
                  Load More Artists
                </AnimatedButton>
              </FadeIn>
            )} */}
          </div>
        </div>
      </div>
    </div>
  )
}
