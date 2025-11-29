"use client"

import { useState } from "react"
import { MainNav } from "@/components/navigation/main-nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, CreditCard, Smartphone, ArrowRight, Check } from "lucide-react"

const donationTiers = [
  { amount: 25, label: "$25", description: "Support general operations" },
  { amount: 50, label: "$50", description: "Help community outreach" },
  { amount: 100, label: "$100", description: "Support missions & ministry" },
  { amount: 250, label: "$250", description: "Premium partnership" },
]

const paymentMethods = [
  {
    id: "stripe",
    name: "Credit/Debit Card",
    icon: CreditCard,
    description: "Visa, Mastercard, American Express",
    color: "text-blue-600",
  },
  {
    id: "mpesa",
    name: "M-Pesa",
    icon: Smartphone,
    description: "Mobile money payment (Kenya)",
    color: "text-green-600",
  },
]

export default function DonatePage() {
  const [selectedAmount, setSelectedAmount] = useState(50)
  const [customAmount, setCustomAmount] = useState("")
  const [selectedMethod, setSelectedMethod] = useState("stripe")
  const [donorInfo, setDonorInfo] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isProcessing, setIsProcessing] = useState(false)

  const finalAmount = customAmount ? Number.parseFloat(customAmount) : selectedAmount

  const handleDonate = async () => {
    if (!donorInfo.name || !donorInfo.email) {
      alert("Please fill in your name and email")
      return
    }

    setIsProcessing(true)

    if (selectedMethod === "stripe") {
      try {
        // Call Stripe API
        const response = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: finalAmount,
            name: donorInfo.name,
            email: donorInfo.email,
            message: donorInfo.message,
          }),
        })

        const { clientSecret } = await response.json()
        // Handle Stripe payment
        alert(`Payment intent created. Amount: $${finalAmount}`)
      } catch (error) {
        alert("Payment failed. Please try again.")
      }
    } else if (selectedMethod === "mpesa") {
      // Simulate M-Pesa payment
      alert(`M-Pesa payment initiated for KES ${finalAmount * 142}. You will receive a prompt on your phone.`)
    }

    setIsProcessing(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-slate-950 dark:to-slate-900">
      <MainNav />

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="w-8 h-8 text-red-600" />
            <h1 className="text-4xl font-bold text-blue-900 dark:text-white">Support Our Mission</h1>
            <Heart className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Your generous donation helps us continue our ministry, community outreach, and spiritual growth programs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Donation Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Amount Selection */}
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-blue-900 dark:text-white mb-6">Select Amount</h2>

              {/* Preset Amounts */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {donationTiers.map((tier) => (
                  <button
                    key={tier.amount}
                    onClick={() => {
                      setSelectedAmount(tier.amount)
                      setCustomAmount("")
                    }}
                    className={`p-4 rounded-lg border-2 transition ${
                      selectedAmount === tier.amount && !customAmount
                        ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-blue-300"
                    }`}
                  >
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{tier.label}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{tier.description}</p>
                  </button>
                ))}
              </div>

              {/* Custom Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Or enter custom amount
                </label>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-gray-600 dark:text-gray-400">$</span>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value)
                      setSelectedAmount(0)
                    }}
                    placeholder="0.00"
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </Card>

            {/* Donor Information */}
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-blue-900 dark:text-white mb-6">Your Information</h2>

              <div className="space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={donorInfo.name}
                    onChange={(e) => setDonorInfo({ ...donorInfo, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={donorInfo.email}
                    onChange={(e) => setDonorInfo({ ...donorInfo, email: e.target.value })}
                    placeholder="john@example.com"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Prayer Request or Message (Optional)
                  </label>
                  <textarea
                    value={donorInfo.message}
                    onChange={(e) => setDonorInfo({ ...donorInfo, message: e.target.value })}
                    placeholder="Share your prayer request or message..."
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>
            </Card>

            {/* Payment Method */}
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-blue-900 dark:text-white mb-6">Payment Method</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paymentMethods.map((method) => {
                  const Icon = method.icon
                  return (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`p-6 rounded-lg border-2 transition text-left ${
                        selectedMethod === method.id
                          ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-blue-300"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Icon className={`w-6 h-6 ${method.color}`} />
                        <h3 className="font-bold text-gray-900 dark:text-white">{method.name}</h3>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{method.description}</p>
                    </button>
                  )
                })}
              </div>
            </Card>
          </div>

          {/* Summary */}
          <div>
            <Card className="p-8 sticky top-20">
              <h3 className="text-lg font-bold text-blue-900 dark:text-white mb-6">Donation Summary</h3>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Amount:</span>
                  <span className="font-bold text-gray-900 dark:text-white">${finalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Method:</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {paymentMethods.find((m) => m.id === selectedMethod)?.name}
                  </span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between">
                  <span className="font-bold text-gray-900 dark:text-white">Total:</span>
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">${finalAmount.toFixed(2)}</span>
                </div>
              </div>

              <Button
                onClick={handleDonate}
                disabled={isProcessing || !finalAmount}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg mb-4"
              >
                {isProcessing ? "Processing..." : "Proceed to Payment"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 font-medium">YOUR DONATION IS SECURE</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">Encrypted & secure</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">100% tax deductible</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">Receipt emailed</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
