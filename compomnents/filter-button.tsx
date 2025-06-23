"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Filter, X } from "lucide-react"
import { useRouter } from "next/navigation"
import type { FilterState } from "./artist-filters"

interface FilterButtonProps {
  filters: FilterState
  totalArtists: number
  filteredCount: number
  showClearAll?: boolean
}

export function FilterButton({ filters, showClearAll }: FilterButtonProps) {
  const router = useRouter()

  const activeFiltersCount =
    filters.categories.length +
    filters.locations.length +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000 ? 1 : 0)

  const clearAllFilters = () => {
    router.push("/explore")
  }

  if (showClearAll) {
    return (
      <Button variant="outline" onClick={clearAllFilters}>
        <X className="w-4 h-4 mr-2" />
        Clear All Filters
      </Button>
    )
  }

  return (
    <Button variant="outline" className="relative">
      <Filter className="w-4 h-4 mr-2" />
      Filters
      {activeFiltersCount > 0 && (
        <Badge variant="secondary" className="ml-2">
          {activeFiltersCount}
        </Badge>
      )}
    </Button>
  )
}
