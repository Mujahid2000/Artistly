"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X, ImageIcon } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
  value?: string
  onChange: (value: string) => void
  error?: string
}

export function ImageUpload({ value, onChange, error }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      // In a real app, you'd upload to a service like Vercel Blob or AWS S3
      // For demo purposes, we'll create a local URL
      const url = URL.createObjectURL(file)
      onChange(url)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    if (files[0]) {
      handleFileSelect(files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files[0]) {
      handleFileSelect(files[0])
    }
  }

  const removeImage = () => {
    onChange("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-2">
      <Card
        className={`border-2 border-dashed transition-colors ${
          isDragging ? "border-purple-400 bg-purple-50" : error ? "border-red-300" : "border-gray-300"
        }`}
      >
        <CardContent className="p-6">
          {value ? (
            <div className="relative">
              <div className="relative aspect-video w-full max-w-md mx-auto">
                <Image
                  src={value || "/placeholder.svg"}
                  alt="Uploaded image"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={removeImage}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div
              className="text-center py-8"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <div className="space-y-2">
                <p className="text-lg font-medium text-gray-700">Upload your profile image</p>
                <p className="text-sm text-gray-500">Drag and drop an image here, or click to select</p>
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Image
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileInputChange} className="hidden" />

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}
