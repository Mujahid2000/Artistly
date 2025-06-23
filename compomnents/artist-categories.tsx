"use client"


import { CardContent } from "@/components/ui/card"

import { Music, Users, Headphones, Laugh } from "lucide-react"
import Link from "next/link"
import { FadeIn } from "./motion/fade-in"
import { StaggerContainer } from "./motion/stagger-container"
import { StaggerItem } from "./motion/stagger-item"
import { AnimatedCard } from "./ui/animated-card"

const categories = [
  {
    title: "Singers",
    icon: Music,
    description: "Vocal artists for every genre",
    slug: "singers",
  },
  {
    title: "Dancers",
    icon: Users,
    description: "Professional dance performers",
    slug: "dancers",
  },
  {
    title: "DJs",
    icon: Headphones,
    description: "Music mixers and entertainers",
    slug: "djs",
  },
  {
    title: "Comedians",
    icon: Laugh,
    description: "Stand-up and comedy acts",
    slug: "comedians",
  },
]

export function ArtistCategories() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Browse by Category</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find the perfect artist for your event from our diverse categories of talented performers
          </p>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => {
            const IconComponent = category.icon
            return (
              <StaggerItem key={index}>
                <Link href={`/explore?category=${category.slug}`}>
                  <AnimatedCard className="h-full">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                        <IconComponent className="w-8 h-8 text-purple-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.title}</h3>
                      <p className="text-gray-600">{category.description}</p>
                    </CardContent>
                  </AnimatedCard>
                </Link>
              </StaggerItem>
            )
          })}
        </StaggerContainer>
      </div>
    </section>
  )
}
