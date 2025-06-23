"use client"

import { Button } from "@/components/ui/button"
import { Grid, List } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

interface ViewModeToggleProps {
  currentView: "grid" | "list"
}

export function ViewModeToggle({ currentView }: ViewModeToggleProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleViewChange = (view: "grid" | "list") => {
    const params = new URLSearchParams(searchParams.toString())

    if (view === "grid") {
      params.delete("view") // Default is grid
    } else {
      params.set("view", view)
    }

    router.push(`/explore?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={currentView === "grid" ? "default" : "outline"}
        size="sm"
        onClick={() => handleViewChange("grid")}
      >
        <Grid className="w-4 h-4" />
      </Button>
      <Button
        variant={currentView === "list" ? "default" : "outline"}
        size="sm"
        onClick={() => handleViewChange("list")}
      >
        <List className="w-4 h-4" />
      </Button>
    </div>
  )
}
