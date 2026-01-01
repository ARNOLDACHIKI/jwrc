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

const deepOceanGradient = "bg-[radial-gradient(circle_at_20%_20%,#2f65c6_0%,#214c8e_35%,#0f274f_75%,#081a3a_100%)]"
const sandCanvasGradient = "bg-[radial-gradient(circle_at_20%_20%,#f6ede1_0%,#e9dcc9_45%,#d6c4ad_85%,#c9b69c_100%)]"
const card3dBase =
  "group relative overflow-hidden rounded-3xl border border-white/30 bg-gradient-to-br from-[rgba(246,237,225,0.95)] via-[rgba(234,215,195,0.9)] to-[rgba(216,193,170,0.88)] dark:from-[rgba(43,74,133,0.7)] dark:via-[rgba(27,47,93,0.82)] dark:to-[rgba(14,27,52,0.9)] shadow-[0_35px_90px_-45px_rgba(15,23,42,0.65)] backdrop-blur-xl transform transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-4 hover:scale-[1.02] hover:rotate-[0.6deg] dark:border-white/10"
const cardHighlight =
  "before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.32),transparent_50%)] before:opacity-70 before:transition-opacity before:duration-500 group-hover:before:opacity-100"
const cardGlow =
  "after:absolute after:-inset-10 after:bg-[radial-gradient(circle_at_30%_20%,rgba(47,101,198,0.25),transparent_55%)] after:opacity-0 after:transition-all after:duration-700 group-hover:after:opacity-100 group-hover:after:scale-110"
const cardContent = "relative z-10"

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
    <div className="min-h-screen bg-[radial-gradient(circle_at_10%_15%,#2f65c6_0%,#1b3563_45%,#0c1d3f_100%)] text-slate-100">
      <MainNav />

      {/* Hero Section */}
      <section className={`${deepOceanGradient} relative overflow-hidden text-white py-16 px-4`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.06),transparent_50%)]" />
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h1 className="text-5xl font-bold mb-6">About Jesus Worship and Restoration Church</h1>
          <p className="text-xl text-blue-100/90 max-w-3xl mx-auto">
            Founded in faith, built on love, dedicated to serving Christ and our community. We believe in the power of
            worship, the importance of discipleship, and the call to serve others.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className={`${sandCanvasGradient} text-slate-900 py-16 px-4`}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* Mission */}
            <Card className={`${card3dBase} ${cardHighlight} ${cardGlow} p-8`}>
              <div className={cardContent}>
                <h2 className="text-2xl font-bold text-[#0f2b52] dark:text-white mb-4">Our Mission</h2>
                <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
                  To know Christ deeply, grow spiritually, and impact our community through authentic worship, biblical
                  teaching, and sacrificial service. We exist to glorify God and advance His kingdom through the Gospel
                  of Jesus Christ.
                </p>
              </div>
            </Card>

            {/* Vision */}
            <Card className={`${card3dBase} ${cardHighlight} ${cardGlow} p-8`}>
              <div className={cardContent}>
                <h2 className="text-2xl font-bold text-[#0f2b52] dark:text-white mb-4">Our Vision</h2>
                <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
                  A thriving community of believers transformed by God's grace, marked by passionate worship, authentic
                  relationships, biblical depth, and genuine compassion for those far from God. We aspire to be a beacon
                  of hope in our city.
                </p>
              </div>
            </Card>
          </div>

          {/* History */}
          <Card className={`${card3dBase} ${cardHighlight} ${cardGlow} p-8 mb-8`}>
            <div className={cardContent}>
              <h2 className="text-2xl font-bold text-[#0f2b52] dark:text-white mb-6">Our Story</h2>
              <p className="text-gray-700 dark:text-gray-200 leading-relaxed mb-4">
                Jesus Worship and Restoration Church was founded in 2008 by a small group of believers who shared a passion for
                authentic worship and biblical teaching. What started as a gathering of 45 people in a community center
                has grown into a thriving congregation of over 2,000 members from diverse backgrounds.
              </p>
              <p className="text-gray-700 dark:text-gray-200 leading-relaxed mb-4">
                Over the past 16 years, we have witnessed God's faithfulness through seasons of growth, challenge, and
                transformation. We've seen lives changed, families restored, and our community impacted through outreach
                ministries and service initiatives.
              </p>
              <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
                Today, Jesus Worship and Restoration Church remains committed to our core mission: to help people know Jesus, grow in
                faith, and make a difference in our world. We invite you to join us on this incredible journey.
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* Core Values */}
      <section className={`${deepOceanGradient} py-16 px-4 text-white`}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Our Leadership Team</h2>
          
          {/* Leadership Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Main Pastor */}
            <Card className={`${card3dBase} ${cardHighlight} ${cardGlow} p-8 text-center`}>
              <div className={cardContent}>
                <div className="mb-6 flex justify-center">
                  <div className="w-40 h-40 rounded-full overflow-hidden shadow-lg bg-gray-200 dark:bg-gray-700">
                    <img 
                      src="/rev_caroline.png" 
                      alt="Reverend Caroline Nyagechi" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-[#0f2b52] dark:text-white mb-2">Rev. Caroline Nyagechi</h3>
                <p className="text-[#1f4f9c] dark:text-blue-300 font-semibold text-lg mb-4">Main Pastor</p>
                <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
                  Leading with vision, wisdom, and a heart for God's people. Committed to biblical teaching and spiritual growth.
                </p>
              </div>
            </Card>

            {/* Worship Leader */}
            <Card className={`${card3dBase} ${cardHighlight} ${cardGlow} p-8 text-center`}>
              <div className={cardContent}>
                <div className="mb-6 flex justify-center">
                  <div className="w-40 h-40 rounded-full overflow-hidden shadow-lg bg-gray-200 dark:bg-gray-700">
                    <img 
                      src="/humprey.png" 
                      alt="Humphrey" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-[#0f2b52] dark:text-white mb-2">Humphrey</h3>
                <p className="text-[#1f4f9c] dark:text-blue-300 font-semibold text-lg mb-4">Worship Leader</p>
                <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
                  Passionate about leading people into God's presence through authentic and powerful worship experiences.
                </p>
              </div>
            </Card>

            {/* Community Outreach */}
            <Card className={`${card3dBase} ${cardHighlight} ${cardGlow} p-8 text-center`}>
              <div className={cardContent}>
                <div className="mb-6 flex justify-center">
                  <div className="w-40 h-40 rounded-full overflow-hidden shadow-lg bg-gray-200 dark:bg-gray-700">
                    <img 
                      src="/mzee-kigo.png" 
                      alt="Mzee Kigo" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-[#0f2b52] dark:text-white mb-2">Mzee Kigo</h3>
                <p className="text-[#1f4f9c] dark:text-blue-300 font-semibold text-lg mb-4">Community Outreach</p>
                <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
                  Dedicated to serving our community and reaching those in need with compassion and Christ's love.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className={`${sandCanvasGradient} py-16 px-4`}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-[#0f2b52] dark:text-white mb-12">Our Core Values</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, idx) => {
              const Icon = value.icon
              return (
                <Card key={idx} className={`${card3dBase} ${cardHighlight} ${cardGlow} p-6 text-center`}>
                  <div className={cardContent}>
                    <Icon className="w-12 h-12 text-[#1f4f9c] dark:text-blue-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{value.title}</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-200">{value.description}</p>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={`py-16 px-4 ${deepOceanGradient} text-white border-t border-white/10`}>
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
      <section className={`${sandCanvasGradient} py-16 px-4`}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-[#0f2b52] dark:text-white mb-12">What We Believe</h2>

          <Card className={`${card3dBase} ${cardHighlight} ${cardGlow} p-8`}>
            <div className={`${cardContent} space-y-4`}>
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
      <section className={`${deepOceanGradient} py-16 px-4 text-white`}> 
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Join Our Community</h2>
          <p className="text-blue-100/90 mb-8 text-lg">
            Whether you're exploring faith for the first time or looking for a church home, we'd love to meet you!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sermons">
              <Button className="relative overflow-hidden bg-white text-[#0f2b52] hover:bg-blue-50 border border-white/70 shadow-[0_18px_40px_-18px_rgba(8,26,58,0.55)] transform transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:scale-[1.03] active:scale-[0.99]">
                Watch Sermons
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/events">
              <Button className="relative overflow-hidden bg-white text-[#0f2b52] hover:bg-blue-50 border border-white/70 shadow-[0_18px_40px_-18px_rgba(8,26,58,0.55)] transform transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:scale-[1.03] active:scale-[0.99]">
                View Events
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className={`${sandCanvasGradient} py-16 px-4`}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#0f2b52] dark:text-white mb-8">Get in Touch</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "Address", value: "juja" },
              { label: "Phone", value: "0715377835" },
              { label: "Email", value: "jwrcjuja.1@gmail.com" },
            ].map((contact, idx) => (
              <Card key={idx} className={`${card3dBase} ${cardHighlight} ${cardGlow} p-6 text-center`}>
                <div className={cardContent}>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">{contact.label}</h3>
                  {contact.label === "Address" ? (
                    <a
                      href="https://maps.app.goo.gl/4ATY5qcF53dtuS668?g_st=aw"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#1f4f9c] dark:text-blue-300 font-semibold underline-offset-4 hover:underline"
                    >
                      {contact.value}
                    </a>
                  ) : (
                    <p className="text-gray-700 dark:text-gray-200">{contact.value}</p>
                  )}
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/suggestions">
              <Button className="bg-[#1f4f9c] hover:bg-[#163d7c]">Send us a Message</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
