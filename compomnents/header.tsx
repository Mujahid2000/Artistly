"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary">
              Artistly
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-900 hover:text-primary font-medium">
              Home
            </Link>
            <Link href="/explore" className="text-gray-600 hover:text-primary font-medium">
              Explore Artists
            </Link>
            <Link href="/onboard" className="text-gray-600 hover:text-primary font-medium">
              Onboard Artist
            </Link>
            <Link href="/dashboard" className="text-gray-600 hover:text-primary font-medium">
              Dashboard
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-gray-900 hover:text-primary font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/explore"
                className="text-gray-600 hover:text-primary font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Explore Artists
              </Link>
              <Link
                href="/onboard"
                className="text-gray-600 hover:text-primary font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Onboard Artist
              </Link>
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-primary font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
