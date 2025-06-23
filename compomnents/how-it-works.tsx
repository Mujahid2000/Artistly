import { Search, Send, CheckCircle } from "lucide-react"

const steps = [
  {
    icon: Search,
    title: "Browse Artists",
    description: "Discover talented artists in your area",
  },
  {
    icon: Send,
    title: "Send Booking Request",
    description: "Contact artists directly for your event",
  },
  {
    icon: CheckCircle,
    title: "Get Confirmation",
    description: "Receive booking confirmation and details",
  },
]

export function HowItWorks() {
  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Book your perfect artist in just three simple steps</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const IconComponent = step.icon
            return (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                  <IconComponent className="w-10 h-10 text-white" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white text-purple-600 rounded-full flex items-center justify-center text-sm font-bold border-2 border-purple-600">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
