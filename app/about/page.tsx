"use client"

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

const teamMembers = [
  {
    name: "Pastor James",
    role: "Senior Pastor",
    bio: "Leading our church with passion for God's kingdom for over 15 years",
  },
  {
    name: "Pastor Sarah",
    role: "Worship Director",
    bio: "Creating meaningful worship experiences that connect hearts to God",
  },
  {
    name: "Pastor Michael",
    role: "Community Outreach",
    bio: "Dedicated to serving our community and reaching those in need",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <MainNav />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">About Grace Community Church</h1>
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
              Grace Community Church was founded in 2008 by a small group of believers who shared a passion for
              authentic worship and biblical teaching. What started as a gathering of 45 people in a community center
              has grown into a thriving congregation of over 2,000 members from diverse backgrounds.
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              Over the past 16 years, we have witnessed God's faithfulness through seasons of growth, challenge, and
              transformation. We've seen lives changed, families restored, and our community impacted through outreach
              ministries and service initiatives.
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Today, Grace Community Church remains committed to our core mission: to help people know Jesus, grow in
              faith, and make a difference in our world. We invite you to join us on this incredible journey.
            </p>
          </Card>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 px-4 bg-blue-50 dark:bg-blue-900/10">
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

      {/* Leadership Team */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-blue-900 dark:text-white mb-12">Our Leadership Team</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {teamMembers.map((member, idx) => (
              <Card key={idx} className="p-6 text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{member.name.charAt(0)}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{member.name}</h3>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-3">{member.role}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{member.bio}</p>
              </Card>
            ))}
          </div>

          {/* Full Team Link */}
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              We have a dedicated team of passionate leaders and volunteers serving our community.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "2,000+", label: "Active Members" },
              { number: "16+", label: "Years Serving" },
              { number: "45", label: "Weekly Programs" },
              { number: "50+", label: "Ministry Partnerships" },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <p className="text-4xl font-bold mb-2">{stat.number}</p>
                <p className="text-blue-100">{stat.label}</p>
              </div>
            ))}
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
              { label: "Address", value: "123 Faith Street, City, State 12345" },
              { label: "Phone", value: "(555) 123-4567" },
              { label: "Email", value: "info@gracecommunitychurch.com" },
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
