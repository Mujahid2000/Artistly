import { ArtistCategories } from "@/compomnents/artist-categories";
import { ArtistCTA } from "@/compomnents/artist-cta";
import { HeroSection } from "@/compomnents/hero-section";
import { HowItWorks } from "@/compomnents/how-it-works";


export default function Home() {
  return (
    <div className="bg-white">
      <HeroSection />
      <ArtistCategories />
      <HowItWorks />
      <ArtistCTA />
    </div>
  )
}
