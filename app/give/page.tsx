"use client"

import { useState } from "react"
import { MainNav } from "@/components/navigation/main-nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Smartphone, ArrowRight, Check } from "lucide-react"

const donationTiers = [
  { amount: 500, label: "KES 500", description: "Support general operations" },
  { amount: 1000, label: "KES 1,000", description: "Help community outreach" },
  { amount: 2500, label: "KES 2,500", description: "Support missions & ministry" },
  { amount: 5000, label: "KES 5,000", description: "Premium partnership" },
]

const paymentMethods = [
  {
    id: "mpesa",
    name: "M-Pesa (Paybill)",
    icon: Smartphone,
    description: "Mobile money payment via Paybill (Kenya)",
    color: "text-green-600",
  },
]

export default function GivePage() {
  const [selectedAmount, setSelectedAmount] = useState(1000)
  const [customAmount, setCustomAmount] = useState("")
  const [selectedMethod, setSelectedMethod] = useState("mpesa")
  const [donorInfo, setDonorInfo] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [stkLocalId, setStkLocalId] = useState<number | null>(null)
  const [stkPending, setStkPending] = useState(false)
  const [stkMessage, setStkMessage] = useState<string | null>(null)

  const finalAmount = customAmount ? Number.parseFloat(customAmount) : selectedAmount

  const handleGive = async () => {
    if (!donorInfo.name || !donorInfo.email) {
      alert("Please fill in your name and email")
      return
    }

    if (!finalAmount || Number.isNaN(finalAmount) || finalAmount <= 0) {
      alert('Please enter a donation amount in KES')
      return
    }

    if (selectedMethod === 'mpesa' && !donorInfo.phone) {
      alert('Please enter your phone number for M-Pesa STK Push (e.g. 2547XXXXXXXX)')
      return
    }

    setIsProcessing(true)

    if (selectedMethod === "mpesa") {
      // Use Kenyan Shillings directly. Round to whole shillings for STK.
      const kes = Math.max(1, Math.round(finalAmount || 0))

      // Attempt STK Push first
      try {
        const res = await fetch('/api/mpesa/stk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: donorInfo.phone,
            amount: kes,
            accountReference: '377899',
            transactionDesc: 'Donation'
          })
        })

        const json = await res.json().catch(() => ({}))
        if (res.ok) {
          // STK initiated — provider response contains CheckoutRequestID/MerchantRequestID
          const checkout = json?.provider?.CheckoutRequestID || json?.provider?.checkoutRequestID
          const merchant = json?.provider?.MerchantRequestID || json?.provider?.merchantRequestID
          setStkLocalId(json?.localId || null)
          setStkPending(true)
          setStkMessage('STK Push sent. Please enter your M-Pesa PIN on your phone to complete the payment.')
        } else {
          console.warn('STK Push failed', json)
          // fallback to showing Paybill instructions if STK fails
          const confirmPay = confirm(
            `STK Push failed to initiate. You can still pay manually via M-Pesa Paybill:\n\nPaybill: 247247\nAccount No: 377899\n\nClick OK after you complete the payment to mark as paid.`
          )
          if (!confirmPay) { setIsProcessing(false); return }
          await fetch('/api/donations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: kes, method: 'mpesa', currency: 'KES', kesAmount: kes, donor: donorInfo, note: 'Manual Paybill fallback' })
          }).catch(() => null)
          alert('Recorded manual donation attempt. We will confirm once payment is verified.')
        }
      } catch (err) {
        console.error('STK request error', err)
        const confirmPay = confirm(
          `Could not start STK Push due to a network error. Please use M-Pesa Paybill:\n\nPaybill: 247247\nAccount No: 377899\n\nClick OK after you complete the payment to mark as paid.`
        )
        if (!confirmPay) { setIsProcessing(false); return }
        await fetch('/api/donations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: kes, method: 'mpesa', currency: 'KES', kesAmount: kes, donor: donorInfo, note: 'Manual Paybill fallback (network error)' })
        }).catch(() => null)
        alert('Recorded manual donation attempt. We will confirm once payment is verified.')
      }
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
              <h2 className="text-2xl font-bold text-blue-900 dark:text-white mb-6">Select Amount (KES)</h2>

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
                  <span className="text-2xl font-bold text-gray-600 dark:text-gray-400">KES</span>
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

                {/* Phone for M-Pesa STK Push */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number (M-Pesa)</label>
                  <input
                    type="tel"
                    value={donorInfo.phone}
                    onChange={(e) => setDonorInfo({ ...donorInfo, phone: e.target.value })}
                    placeholder="2547XXXXXXXX"
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
                  <span className="font-bold text-gray-900 dark:text-white">KES {Math.max(0, finalAmount).toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Method:</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {paymentMethods.find((m) => m.id === selectedMethod)?.name}
                  </span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between">
                  <span className="font-bold text-gray-900 dark:text-white">Total:</span>
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">KES {Math.max(0, finalAmount).toFixed(0)}</span>
                </div>
              </div>

              {/* M-Pesa Paybill Instructions */}
              <div className="p-4 mb-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800">
                <h4 className="font-bold text-gray-900 dark:text-white mb-2">Pay via M-Pesa (Paybill)</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Use your M-Pesa app or STK Push to pay to our Paybill.</p>
                <div className="mt-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-gray-500">Paybill</div>
                      <div className="font-mono font-semibold text-lg">247247</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Account No</div>
                      <div className="font-mono font-semibold text-lg">377899</div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">When prompted, enter your name or email in the account reference so we can match your donation. After payment, click 'Proceed to Payment' and confirm to mark as paid.</p>
                </div>
              </div>

              <Button
                onClick={handleGive}
                disabled={isProcessing || !finalAmount}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg mb-4"
              >
                {isProcessing ? "Processing..." : "Proceed to Payment"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              {stkPending && (
                <div className="p-4 rounded-lg border border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 text-sm">
                  <p className="font-semibold mb-2">{stkMessage}</p>
                  <p className="mb-3">Do not enter your M-Pesa PIN on this website — enter it only on your phone when prompted by M-Pesa.</p>
                  <div className="flex gap-2">
                    <Button
                      onClick={async () => {
                        if (!stkLocalId) return
                        try {
                          const res = await fetch(`/api/mpesa/status?localId=${stkLocalId}`)
                          const js = await res.json().catch(() => ({}))
                          const status = js?.donation?.status || js?.donation?.state || 'unknown'
                          alert(`Current payment status: ${status}`)
                          if (status === 'success') {
                            setStkPending(false)
                            setStkMessage('Payment confirmed. Thank you!')
                          }
                        } catch (e) {
                          alert('Could not fetch status')
                        }
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      I've entered PIN — Check status
                    </Button>
                    <Button onClick={() => { setStkPending(false); setStkLocalId(null); setStkMessage(null) }} variant="outline">Cancel</Button>
                  </div>
                </div>
              )}

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
