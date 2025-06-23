import { CardContent } from "@/components/ui/card"
import { Music, Users, Headphones, Laugh } from "lucide-react"
import Link from "next/link"
import { FadeIn } from "./motion/fade-in"
import { StaggerContainer } from "./motion/stagger-container"
import { StaggerItem } from "./motion/stagger-item"
import { AnimatedCard } from "./ui/animated-card"

// Map icon names to lucide-react components
const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
  Music,
  Users,
  Headphones,
  Laugh,
}

export type CategoryArr = Category[]

export interface Category {
  title: string
  icon: string // This is the string name of the icon (e.g., "Music")
  description: string
  slug: string
}

async function getData() {
  const res = await fetch('https://fdecc25b-52d4-4149-87a3-dd37158c68f8.mock.pstmn.io/category', {
    next: { revalidate: 60 }, // optional: for ISR-like behavior
  })
  return res.json()
}

export default async function ArtistCategories() {
  const data = await getData()
 

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
          {data.map((category: Category, index: number) => {
            // Get the icon component from the iconMap using the category.icon string
            const IconComponent = iconMap[category.icon]
            
            // Fallback in case the icon is not found
            if (!IconComponent) {
              console.warn(`Icon "${category.icon}" not found in iconMap`)
              return null // Skip rendering this item or provide a default icon
            }

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