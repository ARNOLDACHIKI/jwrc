import Link from "next/link"
import { MainNav } from "@/components/navigation/main-nav"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Heart, Users, BookOpen, Music, Calendar, Zap, MessageSquare } from "lucide-react"
import { AnimatedHeroCard } from "@/components/animated-hero-card"
import { SocialCards } from "@/components/social-cards"

export default async function Home({ searchParams }: { searchParams?: Promise<{ embedded?: string }> }) {
  const params = await searchParams
  const embedded = params?.embedded === "1"
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(229,236,249,0.94)_0%,rgba(236,233,224,0.92)_18%,rgba(218,206,190,0.88)_38%,rgba(185,151,118,0.82)_56%,rgba(116,142,186,0.88)_76%,rgba(68,98,139,0.92)_90%,rgba(45,68,99,0.95)_100%)] dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.95)_0%,rgba(20,33,61,0.94)_18%,rgba(25,45,80,0.92)_38%,rgba(30,55,100,0.92)_56%,rgba(45,75,130,0.94)_76%,rgba(55,90,150,0.96)_90%,rgba(60,100,160,0.97)_100%)]"
      />

      <div className="relative z-10">
        <MainNav />

        <AnimatedHeroCard embedded={embedded} />

      {/* Features Section */}
      <section className="relative py-16 px-4">
        <div className="absolute inset-0 bg-[#f6eee4]/70 dark:bg-slate-900/70 backdrop-blur-sm border-y border-white/10" aria-hidden />
        <div className="relative max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-[var(--primary)] dark:text-white mb-12">Our Services</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Music, label: "Live Sermons", desc: "Weekly powerful messages", href: null },
              { icon: Users, label: "Volunteer", desc: "Make a difference", href: "/volunteer" },
              { icon: Heart, label: "Give", desc: "Support our mission", href: "/give" },
              { icon: Calendar, label: "Events", desc: "Community gatherings", href: "/events" },
              { icon: BookOpen, label: "Blog", desc: "Spiritual insights", href: null },
              { icon: Zap, label: "Trivia", desc: "Bible quiz game", href: null },
              { icon: Users, label: "Announcements", desc: "Latest updates", href: "/announcements" },
              { icon: MessageSquare, label: "Feedback", desc: "Send suggestions", href: "/suggestions" },
            ].map((feature, idx) => {
              const Icon = feature.icon
              return feature.href ? (
                <Link key={idx} href={feature.href}>
                  <Card className="group relative p-6 h-full overflow-hidden bg-gradient-to-br from-[#f5ebe0] via-white to-[#f0e5d8] dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 hover:from-[#e8ddd0] hover:via-[#f5ebe0] hover:to-[#e0d5c8] dark:hover:from-slate-700 dark:hover:via-slate-800 dark:hover:to-slate-700 transition-all duration-500 cursor-pointer border border-[var(--border)] dark:border-white/10 shadow-lg hover:shadow-2xl transform hover:scale-105 hover:-translate-y-2 hover:rotate-1">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-60 group-hover:opacity-80 dark:from-white/10 dark:opacity-20 dark:group-hover:opacity-30 transition-opacity duration-500 pointer-events-none" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.8),transparent_50%)] opacity-0 group-hover:opacity-100 dark:bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.08),transparent_50%)] dark:group-hover:opacity-40 transition-opacity duration-500 pointer-events-none" />
                    
                    <div className="relative z-10">
                      <div className="bg-gradient-to-br from-[var(--primary)]/20 to-[var(--primary)]/10 dark:from-white/10 dark:to-white/5 w-12 h-12 rounded-lg flex items-center justify-center mb-4 shadow-md group-hover:shadow-lg transition-shadow duration-300">
                        <Icon className="w-6 h-6 text-[var(--primary)] dark:text-blue-300 group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <h3 className="font-bold text-lg text-[var(--primary)] dark:text-white mb-2">{feature.label}</h3>
                      <p className="text-[var(--muted-foreground)] dark:text-gray-400 text-sm">{feature.desc}</p>
                    </div>
                  </Card>
                </Link>
              ) : (
                <Card key={idx} className="group relative p-6 h-full overflow-hidden bg-gradient-to-br from-[#f5ebe0] via-white to-[#f0e5d8] dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 hover:from-[#e8ddd0] hover:via-[#f5ebe0] hover:to-[#e0d5c8] dark:hover:from-slate-700 dark:hover:via-slate-800 dark:hover:to-slate-700 transition-all duration-500 cursor-default border border-[var(--border)] dark:border-white/10 shadow-lg hover:shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-60 group-hover:opacity-80 dark:from-white/10 dark:opacity-20 dark:group-hover:opacity-30 transition-opacity duration-500 pointer-events-none" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.8),transparent_50%)] opacity-0 group-hover:opacity-100 dark:bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.08),transparent_50%)] dark:group-hover:opacity-40 transition-opacity duration-500 pointer-events-none" />
                  
                  <div className="relative z-10">
                    <div className="bg-gradient-to-br from-[var(--primary)]/20 to-[var(--primary)]/10 dark:from-white/10 dark:to-white/5 w-12 h-12 rounded-lg flex items-center justify-center mb-4 shadow-md group-hover:shadow-lg transition-shadow duration-300">
                      <Icon className="w-6 h-6 text-[var(--primary)] dark:text-blue-300 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <h3 className="font-bold text-lg text-[var(--primary)] dark:text-white mb-2">{feature.label}</h3>
                    <p className="text-[var(--muted-foreground)] dark:text-gray-400 text-sm">{feature.desc}</p>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Get in Touch Section */}
      <section className="relative py-16 px-4">
        <div className="absolute inset-0 bg-white/40 dark:bg-slate-900/60 backdrop-blur-sm border-t border-white/15" aria-hidden />
        <div className="relative max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-blue-900 dark:text-white mb-8">Get in Touch</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "Address", value: "juja", href: "https://maps.app.goo.gl/4ATY5qcF53dtuS668?g_st=aw" },
              { label: "Phone", value: "0715377835" },
              { label: "Email", value: "jwrcjuja.1@gmail.com" },
            ].map((contact, idx) => (
              <Card key={idx} className="p-6 text-center">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{contact.label}</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {contact.href ? (
                    <a
                      href={contact.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-blue-700"
                    >
                      {contact.value}
                    </a>
                  ) : (
                    contact.value
                  )}
                </p>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/suggestions">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">Send a Suggestion</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-[#364e78] to-[#2d4463] opacity-95 border-y border-white/10" aria-hidden />
        <div className="relative max-w-5xl mx-auto">
          <div className="text-center space-y-6 mb-12">
            <h2 className="text-4xl font-bold">Ready to Join Our Community?</h2>
            <p className="text-xl text-[#d4dce8]">Sign up today and start your spiritual journey with us</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/signup">
                <Button size="lg" className="bg-white text-[#364e78] hover:bg-gray-50 w-full sm:w-auto">
                  Get Started
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-[#445b8a] w-full sm:w-auto bg-transparent"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>

          {/* Social Cards Component */}
          <SocialCards />
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-[#2d4463] dark:bg-slate-950 text-white py-12 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.06),transparent_40%),radial-gradient(circle_at_70%_0%,rgba(255,255,255,0.04),transparent_35%)]" aria-hidden />
        <div className="relative max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold mb-4">Jesus Worship and Restoration Church</h3>
            <p className="text-[#d4dce8] text-sm">Your spiritual home for worship, growth, and service.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-[#d4dce8]">
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
            <ul className="space-y-2 text-sm text-[#d4dce8]">
              <li>
                <Link href="/volunteer" className="hover:text-white">
                  Volunteer
                </Link>
              </li>
              <li>
                <Link href="/give" className="hover:text-white">
                  Give
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
            <p className="text-[#d4dce8] text-sm">
              📧 jwrcjuja.1@gmail.com
              <br />📞 0715377835
              <br />
              📍{' '}
              <a
                href="https://maps.app.goo.gl/4ATY5qcF53dtuS668?g_st=aw"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-white"
              >
                View on Google Maps
              </a>
            </p>
          </div>
        </div>
        <div className="relative border-t border-[#445b8a] mt-8 pt-8 text-center text-[#d4dce8] text-sm">
          <p>&copy; 2025 Jesus Worship and Restoration Church. All rights reserved.</p>
        </div>
      </footer>
      </div>
    </div>
  )
}
