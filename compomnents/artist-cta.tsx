import { Button } from "@/components/ui/button"
import Link from "next/link"

export function ArtistCTA() {
  return (
    <section className="py-16 lg:py-24 bg-purple-600 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Are you an artist? Get listed today!</h2>
        <p className="text-xl mb-8 text-purple-100 max-w-2xl mx-auto">
          Join our platform and connect with event organizers looking for talented performers like you. Start getting
          booked for amazing events in your area.
        </p>
        <Link href="/onboard">
          <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-3">
            Onboard Yourself
          </Button>
        </Link>
      </div>
    </section>
  )
}
