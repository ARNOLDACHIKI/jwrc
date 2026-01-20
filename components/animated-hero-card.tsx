"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import AnnouncementsCTA from "@/components/announcements-cta"

interface AnimatedHeroCardProps {
  embedded?: boolean
}

export function AnimatedHeroCard({ embedded = false }: AnimatedHeroCardProps) {
  return (
    <section className="relative overflow-hidden py-20 px-4">
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(160deg,rgba(54,78,120,0.98)_0%,rgba(45,68,99,0.95)_55%,rgba(38,58,89,0.93)_100%)] dark:bg-[linear-gradient(160deg,rgba(15,23,42,0.98)_0%,rgba(30,41,59,0.95)_55%,rgba(45,55,72,0.93)_100%)]"
      />
      <div className="absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(255,255,255,0.08),transparent_36%),radial-gradient(circle_at_78%_16%,rgba(138,163,210,0.18),transparent_40%),radial-gradient(circle_at_48%_82%,rgba(66,99,149,0.2),transparent_42%)]" />
      </div>

      <div className="relative max-w-7xl mx-auto flex justify-center items-center min-h-[600px]">
        <div className="animated-church-card group">
          <div className="card-border"></div>
          
          <div className="card-content">
            {/* Collapsed state - JWRC */}
            <div className="logo-container">
              <div className="jwrc-container">
                <div className="jwrc-text">
                  <span className="letter">J</span>
                  <span className="letter">W</span>
                  <span className="letter">R</span>
                  <span className="letter">C</span>
                </div>
                <div className="church-text">CHURCH</div>
                <div className="verse-text">Yet a time is coming and has now come when the true worshipers will worship the Father in the Spirit and in truth - John 4:23</div>
              </div>
              
              {/* Expanded state - Full name */}
              <div className="full-name">
                <div className="name-line">JESUS</div>
                <div className="name-line">WORSHIP AND</div>
                <div className="name-line">RESTORATION</div>
                <div className="name-line">CHURCH</div>
              </div>
            </div>

            {/* Tagline that appears on hover */}
            <div className="tagline">
              Experience vibrant worship, grow in faith, and serve your community
            </div>
          </div>

          {/* Buttons that appear on hover */}
          <div className="action-buttons">
            <AnnouncementsCTA />
            <Link href="/give">
              <Button
                size="lg"
                variant="outline"
                className="border-blue-300/40 text-white hover:bg-blue-600/30 w-full sm:w-auto bg-transparent backdrop-blur-sm"
              >
                Give Now
              </Button>
            </Link>
          </div>

          <span className="bottom-decoration">your spiritual home</span>
        </div>
      </div>

      <style jsx>{`
        .animated-church-card {
          width: 100%;
          max-width: 1200px;
          min-height: 550px;
          background: linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.98) 100%);
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 20px;
          overflow: visible;
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          padding: 100px 60px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        .card-border {
          position: absolute;
          inset: 0px;
          border: 3px solid #93c5fd;
          opacity: 0;
          transform: rotate(5deg);
          border-radius: 20px;
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .bottom-decoration {
          position: absolute;
          left: 50%;
          bottom: 20px;
          transform: translateX(-50%);
          font-size: 10px;
          text-transform: uppercase;
          padding: 0px 10px;
          color: #93c5fd;
          background: transparent;
          opacity: 0;
          letter-spacing: 8px;
          transition: all 0.6s ease-in-out;
          font-weight: 600;
        }

        .card-content {
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 30px;
        }

        .logo-container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 240px;
          width: 100%;
          overflow: visible;
        }

        .jwrc-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .jwrc-text {
          display: flex;
          gap: 25px;
          font-size: 110px;
          font-weight: 900;
          background: linear-gradient(135deg, #93c5fd 0%, #60a5fa 50%, #3b82f6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: 12px;
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          filter: drop-shadow(0 0 30px rgba(147, 197, 253, 0.5));
        }

        .church-text {
          font-size: 52px;
          font-weight: 800;
          color: #93c5fd;
          letter-spacing: 16px;
          text-shadow: 0 0 25px rgba(147, 197, 253, 0.6);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          text-align: center;
        }

        .verse-text {
          font-size: 14px;
          font-weight: 400;
          color: rgba(147, 197, 253, 0.8);
          letter-spacing: 0.5px;
          text-align: center;
          max-width: 600px;
          margin-top: 15px;
          line-height: 1.5;
          font-style: italic;
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .letter {
          display: inline-block;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .full-name {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          opacity: 0;
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          width: 100%;
          text-align: center;
        }

        .name-line {
          font-size: 56px;
          font-weight: 900;
          color: #93c5fd;
          line-height: 1.1;
          letter-spacing: 5px;
          text-shadow: 0 0 20px rgba(147, 197, 253, 0.3);
          margin: 4px 0;
        }

        .tagline {
          font-size: 22px;
          color: rgba(226, 232, 240, 0.9);
          text-align: center;
          max-width: 700px;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.6s ease-in-out 0.3s;
          line-height: 1.6;
        }

        .action-buttons {
          display: flex;
          flex-direction: row;
          gap: 20px;
          justify-content: center;
          flex-wrap: wrap;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.6s ease-in-out 0.4s;
          margin-top: 10px;
        }

        /* Hover Effects */
        .animated-church-card:hover {
          border-radius: 10px;
          transform: scale(1.02);
          min-height: 680px;
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.98) 100%);
        }

        .animated-church-card:hover .card-border {
          inset: 20px;
          opacity: 1;
          transform: rotate(0);
        }

        .animated-church-card:hover .bottom-decoration {
          letter-spacing: 6px;
          opacity: 1;
        }

        .animated-church-card:hover .jwrc-text {
          opacity: 0;
          transform: scale(0.8);
        }

        .animated-church-card:hover .church-text {
          opacity: 0;
          transform: scale(0.8);
        }

        .animated-church-card:hover .verse-text {
          opacity: 0;
          transform: scale(0.8);
        }

        .animated-church-card:hover .jwrc-container {
          opacity: 0;
        }

        .animated-church-card:hover .full-name {
          opacity: 1;
        }

        .animated-church-card:hover .tagline {
          opacity: 1;
          transform: translateY(0);
        }

        .animated-church-card:hover .action-buttons {
          opacity: 1;
          transform: translateY(0);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .animated-church-card {
            padding: 50px 30px;
            min-height: 400px;
          }

          .jwrc-text {
            font-size: 70px;
            gap: 18px;
          }

          .church-text {
            font-size: 36px;
            letter-spacing: 10px;
          }

          .verse-text {
            font-size: 12px;
            max-width: 400px;
            margin-top: 10px;
          }

          .name-line {
            font-size: 38px;
            letter-spacing: 3px;
          }

          .tagline {
            font-size: 18px;
          }

          .animated-church-card:hover {
            min-height: 500px;
          }

          .action-buttons {
            flex-direction: column;
            width: 100%;
          }

          .bottom-decoration {
            font-size: 8px;
            letter-spacing: 4px;
          }
        }

        @media (max-width: 480px) {
          .jwrc-text {
            font-size: 55px;
            gap: 12px;
          }

          .church-text {
            font-size: 28px;
            letter-spacing: 8px;
          }

          .verse-text {
            font-size: 10px;
            max-width: 300px;
            margin-top: 8px;
          }

          .name-line {
            font-size: 28px;
          }

          .tagline {
            font-size: 15px;
          }
        }
      `}</style>
    </section>
  )
}
