"use client"


import { CardContent } from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"

import { MapPin, Star } from "lucide-react"
import Image from "next/image"
import { AnimatedCard } from "./ui/animated-card"
import { ScaleOnHover } from "./motion/scale-on-hover"
import { AnimatedButton } from "./ui/animated-button"

// Updated interface to match the JSON structure
export interface Artist {
  id: string
  name: string
  category: string
  city: string
  fee: string
  email: string
  phone: string
  status: "active" | "pending" | "inactive"
  joinDate: string
  rating: number
  totalBookings: number
}

interface ArtistCardProps {
  artist: Artist
}

export function ArtistCard({ artist }: ArtistCardProps) {
  // Generate a placeholder image URL based on artist ID for consistency
  const imageUrl = `/placeholder.svg?height=300&width=400&text=${encodeURIComponent(artist.name)}`

  return (
    <AnimatedCard className="overflow-hidden">
      <div className="relative aspect-[4/3] overflow-hidden">
        <ScaleOnHover scale={1.1}>
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={artist.name}
            fill
            className="object-cover transition-transform duration-300"
          />
        </ScaleOnHover>
        {artist.status === "active" && (
          <Badge className="absolute top-3 left-3 bg-green-500 hover:bg-green-600">Verified</Badge>
        )}
        <Badge className="absolute top-3 right-3 bg-purple-600 hover:bg-purple-700">{artist.category}</Badge>
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg text-gray-900 mb-1">{artist.name}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{artist.city}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{artist.rating}</span>
            </div>
            <span className="text-sm text-gray-500">({artist.totalBookings} bookings)</span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-bold text-purple-600">{artist.fee}</span>
              <span className="text-sm text-gray-500 ml-1">per event</span>
            </div>
          </div>

          <AnimatedButton className="w-full bg-purple-600 hover:bg-purple-700">Ask for Quote</AnimatedButton>
        </div>
      </CardContent>
    </AnimatedCard>
  )
}
