"use server"

import { writeFile, readFile } from "fs/promises"
import { join } from "path"
import { revalidatePath } from "next/cache"

export interface OnboardFormData {
  name: string
  bio: string
  category: string
  languages: string[]
  fee: string
  image: string
  location: string
  phone: string
  email: string
  experience: string
  availability: string[]
}

export async function submitArtistApplication(formData: OnboardFormData) {
  try {
    // Read the current artists data
    const filePath = join(process.cwd(), "data", "artists.json")
    const fileContents = await readFile(filePath, "utf8")
    interface Artist {
      id: string;
      name: string;
      category: string;
      city: string;
      fee: string;
      email: string;
      phone: string;
      status: "pending" | "approved" | "rejected";
      joinDate: string;
      rating: number;
      totalBookings: number;
      bio: string;
      experience: string;
      languages: string[];
      availability: string[];
      image: string;
    }
    const artists: Artist[] = JSON.parse(fileContents);

    // Generate new artist ID
    const newId = (Math.max(...artists.map((a: Artist) => Number.parseInt(a.id))) + 1).toString()

    // Create new artist object matching the JSON structure
    const newArtist = {
      id: newId,
      name: formData.name,
      category: formData.category,
      city: formData.location,
      fee: formData.fee,
      email: formData.email,
      phone: formData.phone,
      status: "pending" as const, // New applications start as pending
      joinDate: new Date().toISOString().split("T")[0], // Current date in YYYY-MM-DD format
      rating: 0, // New artists start with 0 rating
      totalBookings: 0, // New artists start with 0 bookings
      // Additional fields for extended artist profile
      bio: formData.bio,
      experience: formData.experience,
      languages: formData.languages,
      availability: formData.availability,
      image: formData.image,
    }

    // Add the new artist to the array
    artists.push(newArtist)

    // Write the updated data back to the file
    await writeFile(filePath, JSON.stringify(artists, null, 2))

    // Revalidate the pages that use this data
    revalidatePath("/explore")
    revalidatePath("/dashboard")

    return {
      success: true,
      message: "Application submitted successfully!",
      artistId: newId,
    }
  } catch (error) {
    console.error("Error saving artist application:", error)
    return {
      success: false,
      message: "Failed to submit application. Please try again.",
    }
  }
}
