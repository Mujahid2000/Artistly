"use client"

import Image from "next/image"
import Link from "next/link"
import { FadeIn } from "./motion/fade-in"
import { SlideIn } from "./motion/slide-in"
import { AnimatedButton } from "./ui/animated-button"

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>
      <Image
        src="https://res.cloudinary.com/diez3alve/image/upload/v1750679099/placeholder_jmert6.svg"
        alt="Artists performing"
        fill
        className="object-cover mix-blend-overlay"
      />
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <FadeIn delay={0.2}>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Find and book top artists for your next event!</h1>
          </FadeIn>

          <SlideIn direction="up" delay={0.4}>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Connect with talented performers in your area. From singers and dancers to DJs and comedians, discover the
              perfect artist to make your event unforgettable.
            </p>
          </SlideIn>

          <FadeIn delay={0.6}>
            <Link href="/explore">
              <AnimatedButton className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-3">
                Explore Artists
              </AnimatedButton>
            </Link>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
