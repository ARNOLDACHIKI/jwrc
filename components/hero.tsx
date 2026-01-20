import Link from "next/link"
import { Button } from "@/components/ui/button"
import AnnouncementsCTA from "@/components/announcements-cta"

interface HeroProps {
  embedded?: boolean
}

export function Hero({ embedded = false }: HeroProps) {
  return (
    <section className="relative overflow-hidden py-20 px-4 text-[var(--logo-ivory)]">
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(160deg,rgba(54,78,120,0.98)_0%,rgba(45,68,99,0.95)_55%,rgba(38,58,89,0.93)_100%)]"
      />
      <div className="absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(255,255,255,0.08),transparent_36%),radial-gradient(circle_at_78%_16%,rgba(138,163,210,0.18),transparent_40%),radial-gradient(circle_at_48%_82%,rgba(66,99,149,0.2),transparent_42%)]" />
      </div>

      <div className="relative max-w-4xl mx-auto text-center">
        <div className="space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight text-[var(--logo-ivory)]">
            <span className="block">Welcome to</span>
            <span className="block text-[var(--primary)]">JESUS</span>
            <span className="block text-[var(--primary)]">WORSHIP AND</span>
            <span className="block text-[var(--primary)]">RESTORATION</span>
            <span className="block text-[var(--primary)]">CHURCH</span>
          </h1>
          <p className="text-xl text-[color-mix(in_srgb,var(--logo-ivory)_80%,black_20%)] max-w-3xl mx-auto">
            Experience vibrant worship, grow in faith, and serve your community. Join us for meaningful sermons,
            fellowship, and spiritual growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <div>
              <AnnouncementsCTA />
            </div>
            <Link href="/give">
              <Button
                size="lg"
                variant="outline"
                className="border-[var(--logo-ivory)]/40 text-[var(--logo-ivory)] hover:bg-[color-mix(in_srgb,var(--logo-brown)_60%,black_40%)] w-full sm:w-auto bg-transparent"
              >
                Give Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
