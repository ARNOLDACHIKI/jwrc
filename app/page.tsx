import Link from "next/link"
import { MainNav } from "@/components/navigation/main-nav"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, Heart, Users, BookOpen, Music, Calendar, Zap, MessageSquare } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-slate-950 dark:to-slate-900">
      <MainNav />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold text-blue-900 dark:text-white leading-tight">
                Welcome to <span className="text-blue-600">Grace Community</span> Church
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Experience vibrant worship, grow in faith, and serve your community. Join us for meaningful sermons,
                fellowship, and spiritual growth.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/sermons">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                    Watch Latest Sermons
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/donate">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-blue-300 text-blue-600 hover:bg-blue-50 w-full sm:w-auto bg-transparent"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Donate Now
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-96 lg:h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg opacity-10 blur-3xl"></div>
              <img
                src="/modern-church-interior-with-spiritual-light.jpg"
                alt="Church interior"
                className="relative w-full h-full object-cover rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-blue-900 dark:text-white mb-12">Our Services</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Music, label: "Live Sermons", desc: "Weekly powerful messages", href: "/sermons" },
              { icon: Users, label: "Volunteer", desc: "Make a difference", href: "/volunteer" },
              { icon: Heart, label: "Donate", desc: "Support our mission", href: "/donate" },
              { icon: Calendar, label: "Events", desc: "Community gatherings", href: "/events" },
              { icon: BookOpen, label: "Blog", desc: "Spiritual insights", href: "/blog" },
              { icon: Zap, label: "Trivia", desc: "Bible quiz game", href: "/trivia" },
              { icon: Users, label: "Announcements", desc: "Latest updates", href: "/announcements" },
              { icon: MessageSquare, label: "Feedback", desc: "Send suggestions", href: "/suggestions" },
            ].map((feature, idx) => {
              const Icon = feature.icon
              return (
                <Link key={idx} href={feature.href}>
                  <Card className="p-6 hover:shadow-lg hover:scale-105 transition duration-300 cursor-pointer h-full">
                    <div className="bg-blue-100 dark:bg-blue-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="font-bold text-lg text-blue-900 dark:text-white mb-2">{feature.label}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{feature.desc}</p>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-4xl font-bold">Ready to Join Our Community?</h2>
          <p className="text-xl text-blue-100">Sign up today and start your spiritual journey with us</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/signup">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 w-full sm:w-auto">
                Get Started
              </Button>
            </Link>
            <Link href="/about">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-blue-500 w-full sm:w-auto bg-transparent"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 dark:bg-slate-950 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold mb-4">Jesus Worship and Restoration Church</h3>
            <p className="text-blue-100 text-sm">Your spiritual home for worship, growth, and service.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-blue-100">
              <li>
                <Link href="/about" className="hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link href="/sermons" className="hover:text-white">
                  Sermons
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-white">
                  Events
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Get Involved</h4>
            <ul className="space-y-2 text-sm text-blue-100">
              <li>
                <Link href="/volunteer" className="hover:text-white">
                  Volunteer
                </Link>
              </li>
              <li>
                <Link href="/donate" className="hover:text-white">
                  Donate
                </Link>
              </li>
              <li>
                <Link href="/announcements" className="hover:text-white">
                  Announcements
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <p className="text-blue-100 text-sm">
              📧 info@gracecommunitychurch.com
              <br />📞 (555) 123-4567
              <br />📍 123 Faith Street, City, State
            </p>
          </div>
        </div>
        <div className="border-t border-blue-800 mt-8 pt-8 text-center text-blue-100 text-sm">
          <p>&copy; 2025 Jesus Worship and Restoration Church. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
