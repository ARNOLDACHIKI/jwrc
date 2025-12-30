"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { MainNav } from "@/components/navigation/main-nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Heart, Globe, Award, ArrowRight, CheckCircle } from "lucide-react"

const values = [
  {
    icon: Heart,
    title: "Compassion",
    description: "We care deeply for our community and seek to serve with love",
  },
  {
    icon: Globe,
    title: "Community",
    description: "Building strong relationships rooted in faith and fellowship",
  },
  {
    icon: Award,
    title: "Growth",
    description: "Spiritual development and transformation through God's Word",
  },
  {
    icon: Users,
    title: "Unity",
    description: "Embracing diversity and walking together in Christ's love",
  },
]

export default function AboutPage() {
  const [stats, setStats] = useState({
    activeMembers: 0,
    yearsServing: 0,
    weeklyPrograms: 0,
    ministryPartnerships: 0,
  })

  useEffect(() => {
    async function loadStats() {
      try {
        const [settingsRes, eventsRes] = await Promise.all([
          fetch('/api/settings'),
          fetch('/api/events'),
        ])

        const [settingsData, eventsData] = await Promise.all([
          settingsRes.json().catch(() => ({})),
          eventsRes.json().catch(() => ({})),
        ])

        const activeMembers = settingsData?.settings?.activeMembers || 0
        const ministryPartnerships = settingsData?.settings?.ministryPartnerships || 0
        const yearsServing = settingsData?.yearsServing || 5

        // Count weekly programs (events in the next 7 days)
        const now = new Date()
        const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
        const weeklyPrograms = (eventsData?.events || []).filter((e: any) => {
          const eventDate = new Date(e.startsAt)
          return eventDate >= now && eventDate <= nextWeek
        }).length

        setStats({
          activeMembers,
          yearsServing,
          weeklyPrograms,
          ministryPartnerships,
        })
      } catch (e) {
        console.error('Failed to load stats', e)
      }
    }
    loadStats()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <MainNav />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">About Jesus Worship and Restoration Church</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Founded in faith, built on love, dedicated to serving Christ and our community. We believe in the power of
            worship, the importance of discipleship, and the call to serve others.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* Mission */}
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-blue-900 dark:text-white mb-4">Our Mission</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                To know Christ deeply, grow spiritually, and impact our community through authentic worship, biblical
                teaching, and sacrificial service. We exist to glorify God and advance His kingdom through the Gospel of
                Jesus Christ.
              </p>
            </Card>

            {/* Vision */}
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-blue-900 dark:text-white mb-4">Our Vision</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                A thriving community of believers transformed by God's grace, marked by passionate worship, authentic
                relationships, biblical depth, and genuine compassion for those far from God. We aspire to be a beacon
                of hope in our city.
              </p>
            </Card>
          </div>

          {/* History */}
          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-bold text-blue-900 dark:text-white mb-6">Our Story</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              Jesus Worship and Restoration Church was founded in 2008 by a small group of believers who shared a passion for
              authentic worship and biblical teaching. What started as a gathering of 45 people in a community center
              has grown into a thriving congregation of over 2,000 members from diverse backgrounds.
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              Over the past 16 years, we have witnessed God's faithfulness through seasons of growth, challenge, and
              transformation. We've seen lives changed, families restored, and our community impacted through outreach
              ministries and service initiatives.
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Today, Jesus Worship and Restoration Church remains committed to our core mission: to help people know Jesus, grow in
              faith, and make a difference in our world. We invite you to join us on this incredible journey.
            </p>
          </Card>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 px-4 bg-blue-50 dark:bg-blue-900/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-blue-900 dark:text-white mb-12">Our Leadership Team</h2>
          
          {/* Leadership Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Main Pastor */}
            <Card className="p-8 text-center">
              <div className="mb-6 flex justify-center">
                <div className="w-40 h-40 rounded-full overflow-hidden shadow-lg bg-gray-200 dark:bg-gray-700">
                  <img 
                    src="/rev_caroline.png" 
                    alt="Reverend Caroline Nyagechi" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-blue-900 dark:text-white mb-2">Rev. Caroline Nyagechi</h3>
              <p className="text-blue-600 dark:text-blue-400 font-semibold text-lg mb-4">Main Pastor</p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Leading with vision, wisdom, and a heart for God's people. Committed to biblical teaching and spiritual growth.
              </p>
            </Card>

            {/* Worship Leader */}
            <Card className="p-8 text-center">
              <div className="mb-6 flex justify-center">
                <div className="w-40 h-40 rounded-full overflow-hidden shadow-lg bg-gray-200 dark:bg-gray-700">
                  <img 
                    src="/humprey.png" 
                    alt="Humphrey" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-blue-900 dark:text-white mb-2">Humphrey</h3>
              <p className="text-blue-600 dark:text-blue-400 font-semibold text-lg mb-4">Worship Leader</p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Passionate about leading people into God's presence through authentic and powerful worship experiences.
              </p>
            </Card>

            {/* Community Outreach */}
            <Card className="p-8 text-center">
              <div className="mb-6 flex justify-center">
                <div className="w-40 h-40 rounded-full overflow-hidden shadow-lg bg-gray-200 dark:bg-gray-700">
                  <img 
                    src="/mzee-kigo.png" 
                    alt="Mzee Kigo" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-blue-900 dark:text-white mb-2">Mzee Kigo</h3>
              <p className="text-blue-600 dark:text-blue-400 font-semibold text-lg mb-4">Community Outreach</p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Dedicated to serving our community and reaching those in need with compassion and Christ's love.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 px-4 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-blue-900 dark:text-white mb-12">Our Core Values</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, idx) => {
              const Icon = value.icon
              return (
                <Card key={idx} className="p-6 text-center">
                  <Icon className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{value.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{value.description}</p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-4xl font-bold mb-2">
                {stats.activeMembers > 0 ? `${stats.activeMembers.toLocaleString()}+` : "..."}
              </p>
              <p className="text-blue-100">Active Members</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold mb-2">
                {stats.yearsServing > 0 ? `${stats.yearsServing}+` : "..."}
              </p>
              <p className="text-blue-100">Years Serving</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold mb-2">
                {stats.weeklyPrograms >= 0 ? `${stats.weeklyPrograms}` : "..."}
              </p>
              <p className="text-blue-100">Weekly Programs</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold mb-2">
                {stats.ministryPartnerships > 0 ? `${stats.ministryPartnerships}+` : "..."}
              </p>
              <p className="text-blue-100">Ministry Partnerships</p>
            </div>
          </div>
        </div>
      </section>

      {/* Beliefs Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-blue-900 dark:text-white mb-12">What We Believe</h2>

          <Card className="p-8">
            <div className="space-y-4">
              {[
                "The authority and reliability of the Bible as God's Word",
                "Jesus Christ is the Son of God, Savior, and Lord of all",
                "Salvation comes through faith in Jesus Christ alone",
                "The Holy Spirit transforms lives and empowers ministry",
                "The church is God's people called to worship, grow, and serve",
                "Believers are called to share Christ's love with all people",
                "God desires justice, compassion, and service to the marginalized",
                "We eagerly anticipate Christ's return and eternal restoration",
              ].map((belief, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700 dark:text-gray-300">{belief}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-50 dark:bg-blue-900/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-blue-900 dark:text-white mb-6">Join Our Community</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
            Whether you're exploring faith for the first time or looking for a church home, we'd love to meet you!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sermons">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Watch Sermons
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/events">
              <Button variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-50 bg-transparent">
                View Events
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-blue-900 dark:text-white mb-8">Get in Touch</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "Address", value: "juja" },
              { label: "Phone", value: "0715377835" },
              { label: "Email", value: "jwrcjuja.1@gmail.com" },
            ].map((contact, idx) => (
              <Card key={idx} className="p-6 text-center">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{contact.label}</h3>
                <p className="text-gray-600 dark:text-gray-400">{contact.value}</p>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/suggestions">
              <Button className="bg-blue-600 hover:bg-blue-700">Send us a Message</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
