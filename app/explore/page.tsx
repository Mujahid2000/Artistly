import { Artist, ArtistCard } from "@/compomnents/artist-card"
import { ArtistFilters, FilterState } from "@/compomnents/artist-filters"
import { FilterButton } from "@/compomnents/filter-button"
import { LoadingArtists } from "@/compomnents/loading-artists"
import { FadeIn } from "@/compomnents/motion/fade-in"
import { SlideIn } from "@/compomnents/motion/slide-in"
import { StaggerContainer } from "@/compomnents/motion/stagger-container"
import { StaggerItem } from "@/compomnents/motion/stagger-item"
import { ViewModeToggle } from "@/compomnents/view-mode-toggle"
import { Suspense } from "react"


interface ExplorePageProps {
  searchParams: {
    categories?: string
    locations?: string
    minPrice?: string
    maxPrice?: string
    view?: string
  }
}

// Server-side function to fetch artists from mock API
async function fetchArtists(searchParams: ExplorePageProps["searchParams"]): Promise<{
  artists: Artist[]
  totalCount: number
  filteredCount: number
}> {
  try {
    // Build query parameters for the mock API
    const params = new URLSearchParams()

    if (searchParams.categories) {
      params.set("categories", searchParams.categories)
    }
    if (searchParams.locations) {
      params.set("locations", searchParams.locations)
    }
    if (searchParams.minPrice) {
      params.set("minPrice", searchParams.minPrice)
    }
    if (searchParams.maxPrice) {
      params.set("maxPrice", searchParams.maxPrice)
    }

    // Fetch from your mock API
    const apiUrl = "https://f645f86c-a1f1-4673-9384-7c09e83d94b6.mock.pstmn.io/artists"
    const fullUrl = params.toString() ? `${apiUrl}?${params.toString()}` : apiUrl

    console.log("Fetching from:", fullUrl) // Debug log

    const response = await fetch(fullUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Add any required headers for your mock API
      },
      cache: "no-store", // Always fetch fresh data for development
      // Alternative options:
      // cache: 'force-cache' // For static data
      // next: { revalidate: 60 } // For ISR with 60 second revalidation
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log("API Response:", data) // Debug log

    // Handle different possible response structures from your mock API
    let artists: Artist[] = []
    let totalCount = 0
    // let filteredCount = 0

    if (Array.isArray(data)) {
      // If the response is directly an array of artists
      artists = data
      totalCount = data.length
    } else if (data.artists && Array.isArray(data.artists)) {
      // If the response has an artists property
      artists = data.artists
      totalCount = data.totalCount || data.artists.length
      // filteredCount = data.filteredCount || data.artists.length
    } else if (data.data && Array.isArray(data.data)) {
      // If the response has a data property
      artists = data.data
      totalCount = data.totalCount || data.data.length
    }

    // Apply client-side filtering if the mock API doesn't support server-side filtering
    const filteredArtists = applyClientSideFiltering(artists, searchParams)

    return {
      artists: filteredArtists,
      totalCount: totalCount,
      filteredCount: filteredArtists.length,
    }
  } catch (error) {
    console.error("Error fetching artists from mock API:", error)

    // Fallback to empty data on error
    return {
      artists: [],
      totalCount: 0,
      filteredCount: 0,
    }
  }
}

// Client-side filtering function (in case mock API doesn't support filtering)
function applyClientSideFiltering(artists: Artist[], searchParams: ExplorePageProps["searchParams"]): Artist[] {
  let filtered = [...artists]

  // Filter by categories
  if (searchParams.categories) {
    const categories = searchParams.categories.split(",").filter(Boolean)
    if (categories.length > 0) {
      filtered = filtered.filter((artist) => categories.includes(artist.category))
    }
  }

  // Filter by locations
  if (searchParams.locations) {
    const locations = searchParams.locations.split(",").filter(Boolean)
    if (locations.length > 0) {
      filtered = filtered.filter((artist) => locations.includes(artist.city))
    }
  }

  // Filter by price range
  const minPrice = searchParams.minPrice ? Number.parseInt(searchParams.minPrice) : 0
  const maxPrice = searchParams.maxPrice ? Number.parseInt(searchParams.maxPrice) : 10000

  if (minPrice > 0 || maxPrice < 10000) {
    filtered = filtered.filter((artist) => {
      // Parse fee string (e.g., "$500-800" -> 500)
      const priceValue = Number.parseInt(artist.fee.split("-")[0].replace("$", ""))
      return priceValue >= minPrice && priceValue <= maxPrice
    })
  }

  return filtered
}

// Server-side function to get current filter state from search params
function getFiltersFromSearchParams(searchParams: ExplorePageProps["searchParams"]): FilterState {
  return {
    categories: searchParams.categories ? searchParams.categories.split(",").filter(Boolean) : [],
    locations: searchParams.locations ? searchParams.locations.split(",").filter(Boolean) : [],
    priceRange: [
      searchParams.minPrice ? Number.parseInt(searchParams.minPrice) : 0,
      searchParams.maxPrice ? Number.parseInt(searchParams.maxPrice) : 10000,
    ] as [number, number],
  }
}

// Artists Content Server Component
async function ArtistsContent({ searchParams }: { searchParams: ExplorePageProps["searchParams"] }) {
  // Server-side data fetching from mock API
  const { artists, totalCount, filteredCount } = await fetchArtists(searchParams)
  const currentFilters = getFiltersFromSearchParams(searchParams)
  const viewMode = (searchParams.view as "grid" | "list") || "grid"

  // Check if any filters are active
  const hasActiveFilters =
    currentFilters.categories.length > 0 ||
    currentFilters.locations.length > 0 ||
    currentFilters.priceRange[0] > 0 ||
    currentFilters.priceRange[1] < 10000

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <SlideIn direction="left" delay={0.3} className="lg:w-80 flex-shrink-0">
          <ArtistFilters filters={currentFilters} totalArtists={totalCount} filteredCount={filteredCount} />
        </SlideIn>

        {/* Main Content */}
        <div className="flex-1">
          {/* Results Header */}
          <FadeIn delay={0.4} className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <p className="text-gray-600">
                Showing {filteredCount} of {totalCount} artists
                {hasActiveFilters && " (filtered)"}
              </p>

              {/* Filter Button for Mobile */}
              <div className="lg:hidden">
                <FilterButton filters={currentFilters} totalArtists={totalCount} filteredCount={filteredCount} />
              </div>
            </div>

            {/* View Mode Toggle */}
            <ViewModeToggle currentView={viewMode} />
          </FadeIn>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <FadeIn delay={0.5} className="mb-6">
              <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-blue-800">Active filters applied</span>
                </div>
              </div>
            </FadeIn>
          )}

          {/* Error State */}
          {artists.length === 0 && totalCount === 0 && (
            <FadeIn className="text-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <p className="text-red-800 text-lg mb-2">Unable to load artists</p>
                <p className="text-red-600 text-sm">
                  There was an error connecting to the API. Please try again later.
                </p>
              </div>
            </FadeIn>
          )}

          {/* Artists Grid */}
          {artists.length > 0 ? (
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
          ) : totalCount > 0 ? (
            <FadeIn className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">No artists found matching your filter criteria</p>
              {hasActiveFilters && (
                <FilterButton
                  filters={currentFilters}
                  totalArtists={totalCount}
                  filteredCount={filteredCount}
                  showClearAll
                />
              )}
            </FadeIn>
          ) : null}

         
        </div>
      </div>
    </>
  )
}

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <FadeIn className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Explore Artists</h1>
          <p className="text-lg text-gray-600">Discover talented performers for your next event</p>
        </FadeIn>

        {/* Artists Content with Suspense */}
        <Suspense fallback={<LoadingArtists />}>
          <ArtistsContent searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  )
}
