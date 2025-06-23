"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { X, Filter } from "lucide-react"
import { useState } from "react"

export interface FilterState {
  categories: string[]
  locations: string[]
  priceRange: [number, number]
}

interface ArtistFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  onClearFilters: () => void
}

// Updated categories to match JSON data
const categories = ["Singer", "DJ", "Dancer", "Comedian", "Musician", "Magician", "Band"]

// Updated locations to match JSON data
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

export function ArtistFilters({ filters, onFiltersChange, onClearFilters }: ArtistFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked ? [...filters.categories, category] : filters.categories.filter((c) => c !== category)

    onFiltersChange({
      ...filters,
      categories: newCategories,
    })
  }

  const handleLocationChange = (location: string, checked: boolean) => {
    const newLocations = checked ? [...filters.locations, location] : filters.locations.filter((l) => l !== location)

    onFiltersChange({
      ...filters,
      locations: newLocations,
    })
  }

  const handlePriceRangeChange = (value: number[]) => {
    onFiltersChange({
      ...filters,
      priceRange: [value[0], value[1]],
    })
  }

  const activeFiltersCount =
    filters.categories.length +
    filters.locations.length +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000 ? 1 : 0)

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
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Filters</CardTitle>
              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearFilters}
                  className="text-purple-600 hover:text-purple-700"
                >
                  Clear All
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
                  {filters.categories.map((category) => (
                    <Badge key={category} variant="secondary" className="flex items-center gap-1">
                      {category}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => handleCategoryChange(category, false)} />
                    </Badge>
                  ))}
                  {filters.locations.map((location) => (
                    <Badge key={location} variant="secondary" className="flex items-center gap-1">
                      {location}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => handleLocationChange(location, false)} />
                    </Badge>
                  ))}
                  {(filters.priceRange[0] > 0 || filters.priceRange[1] < 10000) && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      ${filters.priceRange[0]} - ${filters.priceRange[1]}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => handlePriceRangeChange([0, 10000])} />
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
                      checked={filters.categories.includes(category)}
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
                      checked={filters.locations.includes(location)}
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
                  value={filters.priceRange}
                  onValueChange={handlePriceRangeChange}
                  max={10000}
                  min={0}
                  step={100}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>${filters.priceRange[0]}</span>
                  <span>${filters.priceRange[1]}+</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
