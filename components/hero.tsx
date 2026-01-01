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

      <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight text-[var(--logo-ivory)]">
            <span className="block">Welcome to</span>
            <span className="block text-[var(--primary)]">JESUS</span>
            <span className="block text-[var(--primary)]">WORSHIP AND</span>
            <span className="block text-[var(--primary)]">RESTORATION</span>
            <span className="block text-[var(--primary)]">CHURCH</span>
          </h1>
          <p className="text-xl text-[color-mix(in_srgb,var(--logo-ivory)_80%,black_20%)]">
            Experience vibrant worship, grow in faith, and serve your community. Join us for meaningful sermons,
            fellowship, and spiritual growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <div>
              <AnnouncementsCTA />
            </div>
            <Link href="/donate">
              <Button
                size="lg"
                variant="outline"
                className="border-[var(--logo-ivory)]/40 text-[var(--logo-ivory)] hover:bg-[color-mix(in_srgb,var(--logo-brown)_60%,black_40%)] w-full sm:w-auto bg-transparent"
              >
                Donate Now
              </Button>
            </Link>
          </div>
        </div>

        {!embedded ? (
          <div className="relative h-full w-full [perspective:2000px]">
            <div className="absolute -left-6 bottom-6 h-10 w-[110%] bg-black/30 blur-2xl rounded-full opacity-50" aria-hidden />
            <div className="relative mx-auto max-w-2xl rotate-[-6deg] transform-gpu transition duration-700 ease-out hover:rotate-[-2deg]">
              <div className="relative overflow-hidden rounded-[20px] bg-gradient-to-b from-[#2d1c14] via-[#1c120d] to-[#0f0a07] shadow-2xl border border-[#2d1c14]/60">
                <div className="absolute inset-x-6 top-4 h-3 rounded-full bg-black/50 flex items-center gap-2 px-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#e15c56]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#e0b86a]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#6ea3ff]" />
                </div>

                <div className="mt-10 px-4 pb-4">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-[14px] bg-[#0d1827] border border-[#0f2433] shadow-inner">
                    <iframe
                      src="/?embedded=1"
                      title="JWRC live preview"
                      className="absolute inset-0 h-full w-full border-0 bg-white"
                      loading="lazy"
                    />
                    <div className="pointer-events-none absolute inset-0 rounded-[14px] ring-1 ring-white/5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative h-80 w-full rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-center px-6">
            <p className="text-[var(--logo-ivory)]/80">Embedded preview</p>
          </div>
        )}
      </div>
    </section>
  )
}
