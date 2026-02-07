"use client"

import { useState } from "react"

interface TicketPrinterProps {
  eventTitle: string
  eventDate: string
  eventLocation: string
  userName: string
  userEmail: string
  userPhone: string
  userImage?: string
  ticketRef: string
}

export function TicketPrinter({
  eventTitle,
  eventDate,
  eventLocation,
  userName,
  userEmail,
  userPhone,
  userImage,
  ticketRef
}: TicketPrinterProps) {
  const [isPrinting, setIsPrinting] = useState(false)

  const handlePrint = () => {
    setIsPrinting(true)
    // Just show the animation, user will press Ctrl+P to actually print
    setTimeout(() => {
      setIsPrinting(false)
    }, 1700)
  }

  return (
    <div className={`ticket-wrapper ${isPrinting ? 'printing' : ''}`}>
      <div className="printer-container">
        <div className="printer"></div>

        <div className="printer-display">
          <span className="printer-message">Click to print</span>
          <div className="letter-wrapper">
            <span className="letter">P</span>
            <span className="letter">r</span>
            <span className="letter">i</span>
            <span className="letter">n</span>
            <span className="letter">t</span>
            <span className="letter">i</span>
            <span className="letter">n</span>
            <span className="letter">g</span>
            <span className="letter">.</span>
            <span className="letter">.</span>
            <span className="letter">.</span>
          </div>
        </div>

        <button className="print-button" onClick={handlePrint}>🖨</button>

        <div className="receipt-wrapper">
          <div className="receipt">
            <div className="receipt-header">
              JWRC Event Ticket
              {userImage && (
                <div className="ticket-avatar">
                  <img src={userImage} alt={userName} />
                </div>
              )}
            </div>
            <div className="receipt-subheader">
              Ref: #{ticketRef} <br />
              {new Date().toLocaleDateString('en-US')}
            </div>
            <div className="ticket-details">
              <div className="detail-row">
                <span className="label">Event:</span>
                <span className="value">{eventTitle}</span>
              </div>
              <div className="detail-row">
                <span className="label">Date:</span>
                <span className="value">{eventDate}</span>
              </div>
              <div className="detail-row">
                <span className="label">Location:</span>
                <span className="value">{eventLocation}</span>
              </div>
              <div className="detail-divider"></div>
              <div className="detail-row">
                <span className="label">Name:</span>
                <span className="value">{userName}</span>
              </div>
              <div className="detail-row">
                <span className="label">Email:</span>
                <span className="value break-all">{userEmail}</span>
              </div>
              {userPhone && (
                <div className="detail-row">
                  <span className="label">Phone:</span>
                  <span className="value">{userPhone}</span>
                </div>
              )}
            </div>
            <div className="receipt-message">
              Present this ticket at the event entrance. <br />
              See you there!
            </div>
          </div>
        </div>
      </div>

      <div className="print-instruction print:hidden" style={{
        textAlign: 'center',
        marginTop: '2rem',
        padding: '1rem',
        background: '#f0f9ff',
        border: '2px solid #3b82f6',
        borderRadius: '8px',
        color: '#1e40af',
        fontSize: '16px',
        fontWeight: '600'
      }}>
        📄 Press <kbd style={{
          background: '#1e40af',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '4px',
          fontFamily: 'monospace',
          margin: '0 4px'
        }}>Ctrl+P</kbd> (or <kbd style={{
          background: '#1e40af',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '4px',
          fontFamily: 'monospace',
          margin: '0 4px'
        }}>Cmd+P</kbd> on Mac) to print this ticket
      </div>

      <style jsx>{`
        .ticket-wrapper {
          --printer-color: #dcdac4;
          --printer-color-2: #c0beaa;
          --receipt-color: #f5f5f5;
          font-size: 14px;
          user-select: none;
        }

        .printer-container {
          position: relative;
          margin: 60px auto;
          width: 320px;
        }

        .printer {
          width: 320px;
          height: 80px;
          border-radius: 0 0 8px 8px;
          background-color: var(--printer-color);
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAUVBMVEWFhYWDg4N3d3dtbW17e3t1dXWBgYGHh4d5eXlzc3OLi4ubm5uVlZWPj4+NjY19fX2JiYl/f39ra2uRkZGZmZlpaWmXl5dvb29xcXGTk5NnZ2c8TV1mAAAAG3RSTlNAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAvEOwtAAAFVklEQVR4XpWWB67c2BUFb3g557T/hRo9/WUMZHlgr4Bg8Z4qQgQJlHI4A8SzFVrapvmTF9O7dmYRFZ60YiBhJRCgh1FYhiLAmdvX0CzTOpNE77ME0Zty/nWWzchDtiqrmQDeuv3powQ5ta2eN0FY0InkqDD73lT9c9lEzwUNqgFHs9VQce3TVClFCQrSTfOiYkVJQBmpbq2L6iZavPnAPcoU0dSw0SUTqz/GtrGuXfbyyBniKykOWQWGqwwMA7QiYAxi+IlPdqo+hYHnUt5ZPfnsHJyNiDtnpJyayNBkF6cWoYGAMY92U2hXHF/C1M8uP/ZtYdiuj26UdAdQQSXQErwSOMzt/XWRWAz5GuSBIkwG1H3FabJ2OsUOUhGC6tK4EMtJO0ttC6IBD3kM0ve0tJwMdSfjZo+EEISaeTr9P3wYrGjXqyC1krcKdhMpxEnt5JetoulscpyzhXN5FRpuPHvbeQaKxFAEB6EN+cYN6xD7RYGpXpNndMmZgM5Dcs3YSNFDHUo2LGfZuukSWyUYirJAdYbF3MfqEKmjM+I2EfhA94iG3L7uKrR+GdWD73ydlIB+6hgref1QTlmgmbM3/LeX5GI1Ux1RWpgxpLuZ2+I+IjzZ8wqE4nilvQdkUdfhzI5QDWy+kw5Wgg2pGpeEVeCCA7b85BO3F9DzxB3cdqvBzWcmzbyMiqhzuYqtHRVG2y4x+KOlnyqla8AoWWpuBoYRxzXrfKuILl6SfiWCbjxoZJUaCBj1CjH7GIaDbc9kqBY3W/Rgjda1iqQcOJu2WW+76pZC9QG7M00dffe9hNnseupFL53r8F7YHSwJWUKP2q+k7RdsxyOB11n0xtOvnW4irMMFNV4H0uqwS5ExsmP9AxbDTc9JwgneAT5vTiUSm1E7BSflSt3bfa1tv8Di3R8n3Af7MNWzs49hmauE2wP+ttrq+AsWpFG2awvsuOqbipWHgtuvuaAE+A1Z/7gC9hesnr+7wqCwG8c5yAg3AL1fm8T9AZtp/bbJGwl1pNrE7RuOX7PeMRUERVaPpEs+yqeoSmuOlokqw49pgomjLeh7icHNlG19yjs6XXOMedYm5xH2YxpV2tc0Ro2jJfxC50ApuxGob7lMsxfTbeUv07TyYxpeLucEH1gNd4IKH2LAg5TdVhlCafZvpskfncCfx8pOhJzd76bJWeYFnFciwcYfubRc12Ip/ppIhA1/mSZ/RxjFDrJC5xifFjJpY2Xl5zXdguFqYyTR1zSp1Y9p+tktDYYSNflcxI0iyO4TPBdlRcpeqjK/piF5bklq77VSEaA+z8qmJTFzIWiitbnzR794USKBUaT0NTEsVjZqLaFVqJoPN9ODG70IPbfBHKK+/q/AWR0tJzYHRULOa4MP+W/HfGadZUbfw177G7j/OGbIs8TahLyynl4X4RinF793Oz+BU0saXtUHrVBFT/DnA3ctNPoGbs4hRIjTok8i+algT1lTHi4SxFvONKNrgQFAq2/gFnWMXgwffgYMJpiKYkmW3tTg3ZQ9Jq+f8XN+A5eeUKHWvJWJ2sgJ1Sop+wwhqFVijqWaJhwtD8MNlSBeWNNWTa5Z5kPZw5+LbVT99wqTdx29lMUH4OIG/D86ruKEauBjvH5xy6um/Sfj7ei6UUVk4AIl3MyD4MSSTOFgSwsH/QJWaQ5as7ZcmgBZkzjjU1UrQ74ci1gWBCSGHtuV1H2mhSnO3Wp/3fEV5a+4wz//6qy8JxjZsmxxy5+4w9CDNJY09T072iKG0EnOS0arEYgXqYnXcYHwjTtUNAcMelOd4xpkoqiTYICWFq0JSiPfPDQdnt+4/wuqcXY47QILbgAAAABJRU5ErkJggg==);
          border: 2px solid var(--printer-color-2);
          box-shadow: 0 16px 32px 0px #0002, 0 -30px 16px 0px #0001;
        }

        .printer::before {
          content: "";
          position: absolute;
          top: -30px;
          left: 0;
          width: 100%;
          height: 70px;
          border-radius: 12px 12px 0 0;
          border-bottom: 2px solid #0003;
          box-shadow: 0 12px 16px -12px #fff5 inset, 0 -6px 16px -6px #0003 inset, 0 6px 8px -6px #0004;
          box-sizing: border-box;
          background-color: inherit;
          background-image: inherit;
          filter: brightness(1.12);
          z-index: 2;
        }

        .printer::after {
          content: "";
          position: absolute;
          top: 20px;
          left: 30px;
          width: 260px;
          height: 40px;
          border-radius: 0 0 4px 4px;
          border-bottom: 1px solid #0003;
          background-color: inherit;
          background-image: linear-gradient(to top, var(--printer-color), 60%, var(--printer-color-2));
          box-shadow: 0 4px 4px -2px #0004;
          z-index: 1;
        }

        .printer-display {
          z-index: 2;
          display: flex;
          padding: 6px 8px;
          position: absolute;
          top: -10px;
          left: 30px;
          width: 160px;
          height: 32px;
          background-color: #000;
          background-image: linear-gradient(transparent 0, #fff2 90%, transparent 100%);
          background-size: 100% 8px;
          background-repeat: no-repeat;
          border: 3px solid var(--printer-color-2);
          border-radius: 6px;
          box-sizing: border-box;
          box-shadow: -1px -1px 2px 0 #fff9 inset, 1px 1px 5px 1px #000 inset, 0 0 1px 2px #0002;
          font-family: "Courier New", Courier, monospace;
          font-size: 0.8em;
          color: #5aff5a;
          filter: drop-shadow(1px 1px 1px #0002);
        }

        .print-button {
          z-index: 2;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2em;
          position: absolute;
          top: -30px;
          right: 0;
          margin: 16px;
          border: 1px solid #0001;
          border-radius: 6px;
          width: 48px;
          height: 36px;
          background-color: var(--printer-color);
          box-shadow: 1px 1px 2px 0 #fff8 inset, -1px -1px 2px 0 #0002 inset, 0 2px 6px 0px #0002;
          transition: box-shadow 0.1s ease-in-out, transform 0.1s ease-in-out;
        }

        .print-button:hover {
          box-shadow: 2px 2px 2px 0 #fff9 inset, -2px -2px 2px 0 #0002 inset, 0 2px 10px 0px #0002;
          transform: scale(1.05);
        }

        .print-button:active {
          box-shadow: 2px 2px 2px 0 #0002 inset, -2px -2px 2px 0 #fff9 inset, 0 0px 4px 0px #fff9;
          transform: scale(0.95);
        }

        .receipt-wrapper {
          position: absolute;
          top: 0;
          left: 44px;
          filter: drop-shadow(0 0 12px #0001);
          transform: translateY(-100%);
          clip-path: inset(100% -100px -100px -100px);
          transition: clip-path 0.5s;
        }

        .receipt {
          z-index: 2;
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 1em;
          padding: 16px;
          width: 200px;
          min-height: 160px;
          font-size: 0.75em;
          font-family: "Azeret Mono", "Roboto Mono", monospace;
          font-weight: 400;
          color: #444;
          background-color: var(--receipt-color);
          box-shadow: 0 12px 12px 0 #0001, 0 24px 24px 0 #0001, 0 36px 36px 0 #0001;
        }

        .receipt::before,
        .receipt::after {
          --angle: 45deg;
          content: "";
          display: block;
          position: absolute;
          left: 0px;
          width: 100%;
          height: 8px;
          background: linear-gradient(calc(var(--angle) * -1), var(--receipt-color) 4px, transparent 0),
            linear-gradient(var(--angle), var(--receipt-color) 4px, transparent 0);
          background-position: 4px 0;
          background-repeat: repeat-x;
          background-size: 8px 8px;
        }

        .receipt::before {
          top: -8px;
          background-position: 4px 0;
        }

        .receipt::after {
          bottom: -8px;
          background-position: 0 100%;
          --angle: 225deg;
        }

        .receipt-header,
        .receipt-subheader,
        .receipt-message {
          display: flex;
          justify-content: space-between;
          padding: 0.2em 0;
        }

        .receipt-header {
          font-size: 1.1em;
          font-weight: 600;
          align-items: center;
          flex-direction: column;
          gap: 0.5em;
        }

        .receipt-subheader {
          border-bottom: 1px dashed #ccc;
        }

        .receipt-message {
          justify-content: center;
          text-align: center;
          padding: 0 1em;
          font-size: 0.9em;
          line-height: 1.4;
        }

        .ticket-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid #ccc;
        }

        .ticket-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .ticket-details {
          display: flex;
          flex-direction: column;
          gap: 0.5em;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          gap: 0.5em;
          line-height: 1.4;
        }

        .detail-row .label {
          font-weight: 600;
          white-space: nowrap;
        }

        .detail-row .value {
          text-align: right;
          word-break: break-word;
        }

        .detail-divider {
          border-top: 1px dashed #ccc;
          margin: 0.3em 0;
        }

        .letter-wrapper {
          position: inherit;
          display: flex;
        }

        .letter {
          display: inline-block;
          opacity: 0;
        }

        .ticket-wrapper.printing .receipt-wrapper {
          animation: print 1.2s 1 forwards ease-in, display 0.4s 1 forwards cubic-bezier(0, 0.63, 0.96, 1.1);
          animation-delay: 0s, 1.35s;
        }

        .ticket-wrapper.printing .printer-message {
          opacity: 0;
        }

        .ticket-wrapper.printing .letter {
          animation: show-text 0.6s 1 forwards linear;
        }

        .ticket-wrapper.printing .letter:nth-child(1) { animation-delay: 0.05s; }
        .ticket-wrapper.printing .letter:nth-child(2) { animation-delay: 0.1s; }
        .ticket-wrapper.printing .letter:nth-child(3) { animation-delay: 0.15s; }
        .ticket-wrapper.printing .letter:nth-child(4) { animation-delay: 0.2s; }
        .ticket-wrapper.printing .letter:nth-child(5) { animation-delay: 0.25s; }
        .ticket-wrapper.printing .letter:nth-child(6) { animation-delay: 0.3s; }
        .ticket-wrapper.printing .letter:nth-child(7) { animation-delay: 0.35s; }
        .ticket-wrapper.printing .letter:nth-child(8) { animation-delay: 0.4s; }
        .ticket-wrapper.printing .letter:nth-child(9) { animation-delay: 0.45s; }
        .ticket-wrapper.printing .letter:nth-child(10) { animation-delay: 0.5s; }
        .ticket-wrapper.printing .letter:nth-child(11) { animation-delay: 0.55s; }

        @keyframes print {
          100% {
            transform: translateY(10%);
            clip-path: inset(-20% -100px -100px -100px);
          }
        }

        @keyframes display {
          30% {
            transform: translateY(22%) rotate3d(1, 0, 1, -5deg);
          }
          70% {
            z-index: 5;
          }
          100% {
            z-index: 5;
            transform: translateY(-40%) scale(1.2);
          }
        }

        @keyframes show-text {
          10%, 100% {
            opacity: 1;
          }
        }

        @media print {
          body, html {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            width: 100% !important;
            height: 100% !important;
          }

          * {
            margin: 0 !important;
            padding: 0 !important;
          }
          
          .ticket-wrapper {
            --printer-color: #dcdac4;
            --printer-color-2: #c0beaa;
            --receipt-color: #f5f5f5;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }
          
          .printer-container {
            display: block !important;
            margin: 0 !important;
            padding: 20px !important;
            width: 100% !important;
            align-items: center !important;
            justify-content: center !important;
          }

          .printer {
            display: none !important;
          }

          .printer::before,
          .printer::after {
            display: none !important;
          }

          .printer-display {
            display: none !important;
          }

          .print-button {
            display: none !important;
          }

          .receipt-wrapper {
            position: static !important;
            filter: none !important;
            transform: none !important;
            clip-path: none !important;
            display: block !important;
          }

          .receipt {
            width: 100% !important;
            max-width: 600px !important;
            margin: 0 auto !important;
            min-height: auto !important;
            font-size: 14px !important;
            box-shadow: none !important;
            border: 1px solid #ddd !important;
            padding: 24px !important;
            page-break-inside: avoid !important;
            background: white !important;
          }

          .receipt::before,
          .receipt::after {
            display: none !important;
          }

          .receipt-header {
            font-size: 20px !important;
            margin-bottom: 16px !important;
            text-align: center !important;
          }

          .ticket-avatar {
            width: 80px !important;
            height: 80px !important;
            margin: 0 auto 16px !important;
          }

          .receipt-subheader {
            font-size: 14px !important;
            margin-bottom: 16px !important;
            text-align: center !important;
            border-bottom: 1px solid #ddd !important;
            padding-bottom: 12px !important;
          }

          .ticket-details {
            margin: 16px 0 !important;
            display: flex !important;
            flex-direction: column !important;
            gap: 12px !important;
          }

          .detail-row {
            font-size: 14px !important;
            padding: 8px 0 !important;
            display: flex !important;
            justify-content: space-between !important;
            gap: 16px !important;
            line-height: 1.4 !important;
          }

          .detail-row .label {
            font-weight: 600 !important;
            min-width: 80px !important;
          }

          .detail-row .value {
            text-align: right !important;
            flex: 1 !important;
          }

          .detail-divider {
            border-top: 1px solid #ddd !important;
            margin: 12px 0 !important;
          }

          .receipt-message {
            font-size: 14px !important;
            margin-top: 16px !important;
            text-align: center !important;
            line-height: 1.6 !important;
          }

          .letter-wrapper {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}
