"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { X, Filter, Loader2 } from "lucide-react"
import { useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export interface FilterState {
  categories: string[]
  locations: string[]
  priceRange: [number, number]
}

interface ArtistFiltersProps {
  filters: FilterState
  totalArtists: number
  filteredCount: number
}

// Updated categories to match your API data
const categories = ["Singer", "DJ", "Dancer", "Comedian", "Musician", "Magician", "Band"]

// Updated locations to match your API data
const locations = [
  "New York, NY",
  "Los Angeles, CA",
  "Chicago, IL",
  "Houston, TX",
  "Phoenix, AZ",
  "Philadelphia, PA",
  "San Antonio, TX",
  "San Diego, CA",
  "Dallas, TX",
  "Miami, FL",
  "Las Vegas, NV",
  "Boston, MA",
  "Seattle, WA",
]

export function ArtistFilters({ filters }: ArtistFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [localFilters, setLocalFilters] = useState<FilterState>(filters)
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked
      ? [...localFilters.categories, category]
      : localFilters.categories.filter((c) => c !== category)

    setLocalFilters({
      ...localFilters,
      categories: newCategories,
    })
  }

  const handleLocationChange = (location: string, checked: boolean) => {
    const newLocations = checked
      ? [...localFilters.locations, location]
      : localFilters.locations.filter((l) => l !== location)

    setLocalFilters({
      ...localFilters,
      locations: newLocations,
    })
  }

  const handlePriceRangeChange = (value: number[]) => {
    setLocalFilters({
      ...localFilters,
      priceRange: [value[0], value[1]],
    })
  }

  const applyFilters = () => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString())

      // Update categories
      if (localFilters.categories.length > 0) {
        params.set("categories", localFilters.categories.join(","))
      } else {
        params.delete("categories")
      }

      // Update locations
      if (localFilters.locations.length > 0) {
        params.set("locations", localFilters.locations.join(","))
      } else {
        params.delete("locations")
      }

      // Update price range
      if (localFilters.priceRange[0] > 0) {
        params.set("minPrice", localFilters.priceRange[0].toString())
      } else {
        params.delete("minPrice")
      }

      if (localFilters.priceRange[1] < 10000) {
        params.set("maxPrice", localFilters.priceRange[1].toString())
      } else {
        params.delete("maxPrice")
      }

      // Navigate with new params (this will trigger server-side fetch)
      router.push(`/explore?${params.toString()}`)
      setIsOpen(false)
    })
  }

  const clearAllFilters = () => {
    startTransition(() => {
      setLocalFilters({
        categories: [],
        locations: [],
        priceRange: [0, 10000],
      })
      router.push("/explore")
      setIsOpen(false)
    })
  }

  const removeFilter = (type: "category" | "location", value: string) => {
    if (type === "category") {
      handleCategoryChange(value, false)
    } else {
      handleLocationChange(value, false)
    }
  }

  const removePriceFilter = () => {
    setLocalFilters({
      ...localFilters,
      priceRange: [0, 10000],
    })
  }

  const activeFiltersCount =
    localFilters.categories.length +
    localFilters.locations.length +
    (localFilters.priceRange[0] > 0 || localFilters.priceRange[1] < 10000 ? 1 : 0)

  const hasChanges = JSON.stringify(localFilters) !== JSON.stringify(filters)

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-6">
        <Button variant="outline" onClick={() => setIsOpen(!isOpen)} className="w-full justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </div>
        </Button>
      </div>

      {/* Filter Panel */}
      <div className={`lg:block ${isOpen ? "block" : "hidden"}`}>
        <Card className="sticky top-24">
          <CardHeader className=" gap-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Filters</CardTitle>
              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-purple-600 hover:text-purple-700"
                  disabled={isPending}
                >
                  {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Clear All"}
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            

            {/* Active Filters */}
            {activeFiltersCount > 0 && (
              <div>
                <h4 className="font-medium mb-2">Active Filters</h4>
                <div className="flex flex-wrap gap-2">
                  {localFilters.categories.map((category) => (
                    <Badge key={category} variant="secondary" className="flex items-center gap-1">
                      {category}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => removeFilter("category", category)} />
                    </Badge>
                  ))}
                  {localFilters.locations.map((location) => (
                    <Badge key={location} variant="secondary" className="flex items-center gap-1">
                      {location}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => removeFilter("location", location)} />
                    </Badge>
                  ))}
                  {(localFilters.priceRange[0] > 0 || localFilters.priceRange[1] < 10000) && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      ${localFilters.priceRange[0]} - ${localFilters.priceRange[1]}
                      <X className="w-3 h-3 cursor-pointer" onClick={removePriceFilter} />
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Category Filter */}
            <div>
              <h4 className="font-medium mb-3">Category</h4>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={category}
                      checked={localFilters.categories.includes(category)}
                      onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                    />
                    <label
                      htmlFor={category}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Location Filter */}
            <div>
              <h4 className="font-medium mb-3">Location</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {locations.map((location) => (
                  <div key={location} className="flex items-center space-x-2">
                    <Checkbox
                      id={location}
                      checked={localFilters.locations.includes(location)}
                      onCheckedChange={(checked) => handleLocationChange(location, checked as boolean)}
                    />
                    <label
                      htmlFor={location}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {location}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div>
              <h4 className="font-medium mb-3">Price Range</h4>
              <div className="px-2">
                <Slider
                  value={localFilters.priceRange}
                  onValueChange={handlePriceRangeChange}
                  max={10000}
                  min={0}
                  step={100}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>${localFilters.priceRange[0]}</span>
                  <span>${localFilters.priceRange[1]}+</span>
                </div>
              </div>
            </div>

            {/* Apply Filters Button */}
            <div className="pt-4 border-t">
              <Button onClick={applyFilters} className="w-full" disabled={!hasChanges || isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Applying Filters...
                  </>
                ) : (
                  <>
                    Apply Filters
                    {hasChanges && (
                      <Badge variant="secondary" className="ml-2 bg-white text-purple-600">
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
