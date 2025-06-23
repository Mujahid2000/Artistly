"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { X, CheckCircle, ArrowRight, ArrowLeft, AlertCircle } from "lucide-react"
import { submitArtistApplication } from "./actions"
import { ImageUpload } from "@/compomnents/image-upload"

// Form validation schema
const onboardSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must be less than 50 characters"),
  bio: z.string().min(50, "Bio must be at least 50 characters").max(500, "Bio must be less than 500 characters"),
  category: z.string().min(1, "Please select a category"),
  languages: z.array(z.string()).min(1, "Please select at least one language"),
  fee: z.string().min(1, "Please enter your fee range"),
  image: z.string().min(1, "Please upload a profile image"),
  location: z.string().min(1, "Please enter your location"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  email: z.string().email("Please enter a valid email address"),
  experience: z.string().min(1, "Please select your experience level"),
  availability: z.array(z.string()).min(1, "Please select your availability"),
})

type OnboardFormData = z.infer<typeof onboardSchema>

// Updated categories to match JSON structure
const categories = ["Singer", "DJ", "Dancer", "Comedian", "Musician", "Magician", "Band", "Other"]

const languages = [
  "English",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Portuguese",
  "Chinese",
  "Japanese",
  "Korean",
  "Arabic",
  "Hindi",
  "Other",
]

const feeRanges = ["$100-300", "$300-500", "$500-800", "$800-1200", "$1200-2000", "$2000-5000", "$5000+"]

const experienceLevels = [
  "Beginner (0-2 years)",
  "Intermediate (2-5 years)",
  "Advanced (5-10 years)",
  "Professional (10+ years)",
]

const availabilityOptions = ["Weekdays", "Weekends", "Evenings", "Daytime", "Holidays", "Short Notice"]

export default function OnboardPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submittedArtistId, setSubmittedArtistId] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<OnboardFormData>({
    resolver: zodResolver(onboardSchema),
    mode: "onChange",
    defaultValues: {
      languages: [],
      availability: [],
    },
  })

  const watchedLanguages = watch("languages") || []
  const watchedAvailability = watch("availability") || []

  const totalSteps = 3

  const onSubmit = async (data: OnboardFormData) => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const result = await submitArtistApplication(data)

      if (result.success) {
        setSubmittedArtistId(result.artistId || null)
        setIsSubmitted(true)
      } else {
        setSubmitError(result.message)
      }
    } catch (error) {
      console.error("Form submission error:", error)
      setSubmitError("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep)
    const isStepValid = await trigger(fieldsToValidate)

    if (isStepValid) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps))
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const getFieldsForStep = (step: number): (keyof OnboardFormData)[] => {
    switch (step) {
      case 1:
        return ["name", "email", "phone", "location"]
      case 2:
        return ["category", "bio", "experience", "languages"]
      case 3:
        return ["fee", "availability", "image"]
      default:
        return []
    }
  }

  const handleLanguageChange = (language: string, checked: boolean) => {
    const currentLanguages = watchedLanguages
    const newLanguages = checked ? [...currentLanguages, language] : currentLanguages.filter((l) => l !== language)
    setValue("languages", newLanguages)
  }

  const handleAvailabilityChange = (availability: string, checked: boolean) => {
    const currentAvailability = watchedAvailability
    const newAvailability = checked
      ? [...currentAvailability, availability]
      : currentAvailability.filter((a) => a !== availability)
    setValue("availability", newAvailability)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-md mx-auto text-center">
            <Card>
              <CardContent className="p-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
                <p className="text-gray-600 mb-4">
                  Thank you for joining Artistly! We&apos;ll review your application and get back to you within 2-3 business
                  days.
                </p>
                {submittedArtistId && (
                  <p className="text-sm text-gray-500 mb-6">
                    Your application ID: <span className="font-mono font-semibold">#{submittedArtistId}</span>
                  </p>
                )}
                <div className="space-y-3">
                  <Button onClick={() => (window.location.href = "/")} className="w-full">
                    Return to Home
                  </Button>
                  <Button variant="outline" onClick={() => (window.location.href = "/explore")} className="w-full">
                    Explore Other Artists
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Progress Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Join Artistly</h1>
            <p className="text-gray-600 mb-6">Create your artist profile and start getting booked for events</p>

            {/* Progress Bar */}
            <div className="flex items-center justify-between mb-4">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div key={i} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      i + 1 <= currentStep ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {i + 1}
                  </div>
                  {i < totalSteps - 1 && (
                    <div className={`w-16 h-1 mx-2 ${i + 1 < currentStep ? "bg-purple-600" : "bg-gray-200"}`} />
                  )}
                </div>
              ))}
            </div>

            <div className="text-sm text-gray-500">
              Step {currentStep} of {totalSteps}
            </div>
          </div>

          {/* Error Alert */}
          {submitError && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">{submitError}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <Card>
              <CardHeader>
                <CardTitle>
                  {currentStep === 1 && "Basic Information"}
                  {currentStep === 2 && "Professional Details"}
                  {currentStep === 3 && "Pricing & Availability"}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Step 1: Basic Information */}
                {currentStep === 1 && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input id="name" {...register("name")} placeholder="Enter your full name" />
                        {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
                      </div>

                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input id="email" type="email" {...register("email")} placeholder="your@email.com" />
                        {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input id="phone" {...register("phone")} placeholder="(555) 123-4567" />
                        {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>}
                      </div>

                      <div>
                        <Label htmlFor="location">Location *</Label>
                        <Input id="location" {...register("location")} placeholder="City, State" />
                        {errors.location && <p className="text-sm text-red-600 mt-1">{errors.location.message}</p>}
                      </div>
                    </div>
                  </>
                )}

                {/* Step 2: Professional Details */}
                {currentStep === 2 && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">Category *</Label>
                        <Controller
                          name="category"
                          control={control}
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your category" />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map((category) => (
                                  <SelectItem key={category} value={category}>
                                    {category}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.category && <p className="text-sm text-red-600 mt-1">{errors.category.message}</p>}
                      </div>

                      <div>
                        <Label htmlFor="experience">Experience Level *</Label>
                        <Controller
                          name="experience"
                          control={control}
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select experience level" />
                              </SelectTrigger>
                              <SelectContent>
                                {experienceLevels.map((level) => (
                                  <SelectItem key={level} value={level}>
                                    {level}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.experience && <p className="text-sm text-red-600 mt-1">{errors.experience.message}</p>}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="bio">Bio *</Label>
                      <Textarea
                        id="bio"
                        {...register("bio")}
                        placeholder="Tell us about yourself, your style, and what makes you unique..."
                        rows={4}
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        {watch("bio")?.length || 0}/500 characters (minimum 50)
                      </p>
                      {errors.bio && <p className="text-sm text-red-600 mt-1">{errors.bio.message}</p>}
                    </div>

                    <div>
                      <Label>Languages *</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                        {languages.map((language) => (
                          <div key={language} className="flex items-center space-x-2">
                            <Checkbox
                              id={language}
                              checked={watchedLanguages.includes(language)}
                              onCheckedChange={(checked) => handleLanguageChange(language, checked as boolean)}
                            />
                            <Label htmlFor={language} className="text-sm">
                              {language}
                            </Label>
                          </div>
                        ))}
                      </div>
                      {watchedLanguages.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {watchedLanguages.map((language) => (
                            <Badge key={language} variant="secondary" className="flex items-center gap-1">
                              {language}
                              <X
                                className="w-3 h-3 cursor-pointer"
                                onClick={() => handleLanguageChange(language, false)}
                              />
                            </Badge>
                          ))}
                        </div>
                      )}
                      {errors.languages && <p className="text-sm text-red-600 mt-1">{errors.languages.message}</p>}
                    </div>
                  </>
                )}

                {/* Step 3: Pricing & Availability */}
                {currentStep === 3 && (
                  <>
                    <div>
                      <Label htmlFor="fee">Fee Range *</Label>
                      <Controller
                        name="fee"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your fee range" />
                            </SelectTrigger>
                            <SelectContent>
                              {feeRanges.map((range) => (
                                <SelectItem key={range} value={range}>
                                  {range}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.fee && <p className="text-sm text-red-600 mt-1">{errors.fee.message}</p>}
                    </div>

                    <div>
                      <Label>Availability *</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                        {availabilityOptions.map((option) => (
                          <div key={option} className="flex items-center space-x-2">
                            <Checkbox
                              id={option}
                              checked={watchedAvailability.includes(option)}
                              onCheckedChange={(checked) => handleAvailabilityChange(option, checked as boolean)}
                            />
                            <Label htmlFor={option} className="text-sm">
                              {option}
                            </Label>
                          </div>
                        ))}
                      </div>
                      {watchedAvailability.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {watchedAvailability.map((availability) => (
                            <Badge key={availability} variant="secondary" className="flex items-center gap-1">
                              {availability}
                              <X
                                className="w-3 h-3 cursor-pointer"
                                onClick={() => handleAvailabilityChange(availability, false)}
                              />
                            </Badge>
                          ))}
                        </div>
                      )}
                      {errors.availability && (
                        <p className="text-sm text-red-600 mt-1">{errors.availability.message}</p>
                      )}
                    </div>

                    <div>
                      <Label>Profile Image *</Label>
                      <Controller
                        name="image"
                        control={control}
                        render={({ field }) => (
                          <ImageUpload value={field.value} onChange={field.onChange} error={errors.image?.message} />
                        )}
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <Button type="button" variant="outline" onClick={prevStep} disabled={currentStep === 1}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {currentStep < totalSteps ? (
                <Button type="button" onClick={nextStep}>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
