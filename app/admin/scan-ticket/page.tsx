"use client"

import { useState, useEffect, useRef } from "react"
import { Html5Qrcode } from "html5-qrcode"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, QrCode, Camera, X } from "lucide-react"
import { AdminNav } from "@/components/admin/admin-nav"

interface TicketInfo {
  valid: boolean
  alreadyCheckedIn: boolean
  signup?: {
    id: string
    name: string
    email: string
    phone?: string
    ref: string
    checkedIn: boolean
    checkedInAt?: string
  }
  event?: {
    id: string
    title: string
    startsAt: string
    location?: string
  }
}

export default function ScanTicketPage() {
  const [scanning, setScanning] = useState(false)
  const [ticketInfo, setTicketInfo] = useState<TicketInfo | null>(null)
  const [error, setError] = useState("")
  const [processing, setProcessing] = useState(false)
  const [checkingIn, setCheckingIn] = useState(false)
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const scannerContainerRef = useRef<HTMLDivElement>(null)

  const startScanning = async () => {
    try {
      setError("")
      setTicketInfo(null)
      
      const html5QrCode = new Html5Qrcode("qr-reader")
      scannerRef.current = html5QrCode

      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        onScanSuccess,
        onScanError
      )

      setScanning(true)
    } catch (err) {
      console.error("Error starting scanner:", err)
      setError("Failed to start camera. Please check permissions.")
    }
  }

  const stopScanning = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop()
        scannerRef.current.clear()
        scannerRef.current = null
      } catch (err) {
        console.error("Error stopping scanner:", err)
      }
    }
    setScanning(false)
  }

  const onScanSuccess = async (decodedText: string) => {
    if (processing) return
    
    setProcessing(true)
    await stopScanning()

    try {
      const res = await fetch("/api/events/verify-ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qrData: decodedText }),
      })

      const data = await res.json()

      if (res.ok && data.valid) {
        setTicketInfo(data)
        setError("")
      } else {
        setError(data.error || "Invalid ticket")
      }
    } catch (err) {
      setError("Failed to verify ticket")
      console.error("Verification error:", err)
    } finally {
      setProcessing(false)
    }
  }

  const onScanError = (errorMessage: string) => {
    // Ignore scan errors (these are frequent during scanning)
  }

  const handleCheckIn = async () => {
    if (!ticketInfo?.signup?.id) return

    setCheckingIn(true)
    try {
      const res = await fetch("/api/events/verify-ticket", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signupId: ticketInfo.signup.id }),
      })

      if (res.ok) {
        // Update ticket info to show checked in
        setTicketInfo({
          ...ticketInfo,
          alreadyCheckedIn: true,
          signup: {
            ...ticketInfo.signup!,
            checkedIn: true,
            checkedInAt: new Date().toISOString(),
          },
        })
      } else {
        const data = await res.json()
        setError(data.error || "Failed to check in")
      }
    } catch (err) {
      setError("Failed to check in attendee")
      console.error("Check-in error:", err)
    } finally {
      setCheckingIn(false)
    }
  }

  const reset = () => {
    setTicketInfo(null)
    setError("")
  }

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        stopScanning()
      }
    }
  }, [])

  return (
    <AdminNav>
      <div className="p-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Event Check-In
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Scan QR code tickets to verify and check in attendees
            </p>
          </div>

        {!scanning && !ticketInfo && (
          <Card className="p-8">
            <div className="text-center">
              <div className="mb-6">
                <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
                  <QrCode className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Ready to Scan
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Click the button below to activate the camera and scan attendee QR codes
              </p>
              <Button
                onClick={startScanning}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
              >
                <Camera className="w-5 h-5 mr-2" />
                Start Scanner
              </Button>
            </div>
          </Card>
        )}

        {scanning && (
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Scanning...
              </h2>
              <Button
                onClick={stopScanning}
                variant="outline"
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                <X className="w-4 h-4 mr-2" />
                Stop
              </Button>
            </div>
            <div id="qr-reader" className="rounded-lg overflow-hidden"></div>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
              Position the QR code within the frame
            </p>
          </Card>
        )}

        {error && !ticketInfo && (
          <Card className="p-6 border-red-200 dark:border-red-800">
            <div className="flex items-start gap-4">
              <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">
                  Verification Failed
                </h3>
                <p className="text-red-700 dark:text-red-300 mb-4">{error}</p>
                <Button
                  onClick={reset}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Try Again
                </Button>
              </div>
            </div>
          </Card>
        )}

        {ticketInfo && ticketInfo.valid && (
          <Card className={`p-6 ${
            ticketInfo.alreadyCheckedIn || ticketInfo.signup?.checkedIn
              ? 'border-green-200 dark:border-green-800'
              : 'border-blue-200 dark:border-blue-800'
          }`}>
            <div className="flex items-start gap-4 mb-6">
              <CheckCircle className={`w-8 h-8 flex-shrink-0 ${
                ticketInfo.alreadyCheckedIn || ticketInfo.signup?.checkedIn
                  ? 'text-green-600'
                  : 'text-blue-600'
              }`} />
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                  {ticketInfo.alreadyCheckedIn || ticketInfo.signup?.checkedIn
                    ? '✅ Already Checked In'
                    : '✓ Valid Ticket'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {ticketInfo.event?.title}
                </p>
              </div>
            </div>

            <div className="space-y-4 bg-gray-50 dark:bg-slate-800 p-4 rounded-lg mb-6">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Attendee Name</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {ticketInfo.signup?.name}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                <p className="text-gray-900 dark:text-white">{ticketInfo.signup?.email}</p>
              </div>
              {ticketInfo.signup?.phone && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                  <p className="text-gray-900 dark:text-white">{ticketInfo.signup.phone}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Ticket Reference</p>
                <p className="font-mono text-gray-900 dark:text-white">{ticketInfo.signup?.ref}</p>
              </div>
              {(ticketInfo.alreadyCheckedIn || ticketInfo.signup?.checkedIn) && ticketInfo.signup?.checkedInAt && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Checked In At</p>
                  <p className="text-gray-900 dark:text-white">
                    {new Date(ticketInfo.signup.checkedInAt).toLocaleString()}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              {!ticketInfo.alreadyCheckedIn && !ticketInfo.signup?.checkedIn && (
                <Button
                  onClick={handleCheckIn}
                  disabled={checkingIn}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  {checkingIn ? (
                    "Checking In..."
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Check In
                    </>
                  )}
                </Button>
              )}
              <Button
                onClick={() => {
                  reset()
                  startScanning()
                }}
                variant="outline"
                className="flex-1"
              >
                Scan Next
              </Button>
            </div>
          </Card>
        )}
        </div>
      </div>
    </AdminNav>
  )
}
