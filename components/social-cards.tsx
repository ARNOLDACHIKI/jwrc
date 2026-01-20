'use client'

export function SocialCards() {
  return (
    <>
      <div className="mt-16 pt-12 border-t border-white/20">
        <h3 className="text-2xl font-bold text-center mb-8">Follow Our Church</h3>
        <div className="flex flex-wrap justify-center gap-8">
          {/* X / Discord Card */}
          <div className="social-card" style={{ '--card-bg': 'radial-gradient(circle at 100% 107%, #000000 0%, #1a1a1a 90%)', '--icon-color': '#FFFFFF' } as React.CSSProperties}>
            <div className="social-card-background"></div>
            <div className="social-card-logo">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="social-card-logo-svg">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.6l-5.165-6.75-5.9 6.75h-3.306l7.73-8.835L.966 2.25h6.74l4.888 6.469L17.56 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
              </svg>
            </div>
            <div className="social-box social-box1">
              <span className="social-icon">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="social-svg">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.6l-5.165-6.75-5.9 6.75h-3.306l7.73-8.835L.966 2.25h6.74l4.888 6.469L17.56 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                </svg>
              </span>
            </div>
            <div className="social-box social-box2">
              <span className="social-icon">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="social-svg">
                  <path d="M20.317 4.3671a19.8062 19.8062 0 0 0-4.885-1.515.0741.0741 0 0 0-.0785.0371c-.211.3753-.444.8635-.607 1.25.5882-.0897 1.164-.2166 1.7325-.3529a.0696.0696 0 0 1 .0785.0686 19.7995 19.7995 0 0 1-3.872 6.438.0713.0713 0 0 1-.0257.0276c-1.242.769-2.552 1.331-3.901 1.653a.0718.0718 0 0 0-.0304.1277c.395.304.81.597 1.244.86a.0711.0711 0 0 0 .0417.0028c1.327-.932 2.492-2.286 3.315-3.857.0882-.1802.1762-.3604.2628-.5425a.0731.0731 0 0 1 .0528-.046c1.7855-.4081 3.6545-.4784 5.4818-.3289a.0722.0722 0 0 1 .0655.0505c.265 1.1629.8702 2.2506 1.7462 3.0322a.0719.0719 0 0 0 .0394.0134c.434.263.849.558 1.244.86a.0718.0718 0 0 0 .0305.1277c-1.35-.323-2.659-.888-3.901-1.653a.0713.0713 0 0 1-.0257-.0276c-.692-1.246-1.588-2.388-2.675-3.275a.0729.0729 0 0 1-.0089-.1201c.162-.406.3-.811.435-1.22a.0705.0705 0 0 1 .0914-.0457c1.565.537 3.19.848 4.835.848a.0722.0722 0 0 0 .0722-.0722V4.3671a.0722.0722 0 0 0-.0722-.0722"></path>
                </svg>
              </span>
            </div>
            <div className="social-box social-box3"></div>
          </div>

          {/* TikTok / Instagram Card */}
          <div className="social-card" style={{ '--card-bg': 'radial-gradient(circle at 100% 107%, #000000 0%, #25f4ee 90%)', '--icon-color': '#25f4ee' } as React.CSSProperties}>
            <div className="social-card-background"></div>
            <div className="social-card-logo">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="social-card-logo-svg">
                <path d="M19.498 3h-15c-1.381 0-2.5 1.12-2.5 2.5v15c0 1.38 1.119 2.5 2.5 2.5h15c1.381 0 2.5-1.12 2.5-2.5v-15c0-1.38-1.119-2.5-2.5-2.5zm-11.5 13.5h-2.5v-8h2.5v8zm-1.25-9.25c-.825 0-1.5-.675-1.5-1.5s.675-1.5 1.5-1.5 1.5.675 1.5 1.5-.675 1.5-1.5 1.5zm11.25 9.25h-2.5v-4.5c0-.825-.675-1.5-1.5-1.5s-1.5.675-1.5 1.5v4.5h-2.5v-8h2.5v1.25c.375-.675 1.25-1.25 2.5-1.25 1.935 0 3.5 1.565 3.5 3.5v4.5z"></path>
              </svg>
            </div>
            <div className="social-box social-box1">
              <span className="social-icon">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="social-svg">
                  <path d="M16.6915026,0.92170427 C14.4744748,0.92170427 12.5816822,2.16331504 12.5816822,3.74863387 L12.5816822,10.1274356 C12.5816822,11.6818548 14.4744748,12.9234666 16.6915026,12.9234666 C18.9084814,12.9234666 20.8012739,11.6818548 20.8012739,10.1274356 L20.8012739,3.74863387 C20.8012739,2.16331504 18.9084814,0.92170427 16.6915026,0.92170427"></path>
                </svg>
              </span>
            </div>
            <div className="social-box social-box2">
              <span className="social-icon">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="social-svg">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.85-.07-3.251-.149-4.771-1.699-4.919-4.92-.058-1.266-.07-1.645-.07-4.85s.012-3.584.07-4.85c.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.85-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z"></path>
                </svg>
              </span>
            </div>
            <div className="social-box social-box3"></div>
          </div>

          {/* Facebook / LinkedIn Card */}
          <div className="social-card" style={{ '--card-bg': 'radial-gradient(circle at 100% 107%, #1877F2 0%, #0A66C2 90%)', '--icon-color': '#1877F2' } as React.CSSProperties}>
            <div className="social-card-background"></div>
            <div className="social-card-logo">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="social-card-logo-svg">
                <path d="M18 2h-3a6 6 0 0 0-6 6v3H7v4h2v8h4v-8h3l1-4h-4V8a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </div>
            <div className="social-box social-box1">
              <span className="social-icon">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="social-svg">
                  <path d="M18 2h-3a6 6 0 0 0-6 6v3H7v4h2v8h4v-8h3l1-4h-4V8a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </span>
            </div>
            <div className="social-box social-box2">
              <span className="social-icon">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="social-svg">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.731-2.004 1.436-.103.249-.129.597-.129.946v5.423h-3.554s.047-8.789 0-9.708h3.554v1.375c.425-.654 1.185-1.586 2.882-1.586 2.105 0 3.685 1.376 3.685 4.336v5.583zM5.337 6.556a2.065 2.065 0 1 1 0-4.132 2.065 2.065 0 0 1 0 4.132zm1.782 13.896H3.555V8.744h3.564v11.708zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"></path>
                </svg>
              </span>
            </div>
            <div className="social-box social-box3"></div>
          </div>

          {/* YouTube Card */}
          <div className="social-card" style={{ '--card-bg': 'radial-gradient(circle at 100% 107%, #FF0000 0%, #CC0000 90%)', '--icon-color': '#FF0000' } as React.CSSProperties}>
            <div className="social-card-background"></div>
            <div className="social-card-logo">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="social-card-logo-svg">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"></path>
              </svg>
            </div>
            <div className="social-box social-box1">
              <span className="social-icon">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="social-svg">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"></path>
                </svg>
              </span>
            </div>
            <div className="social-box social-box2">
              <span className="social-icon">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="social-svg">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"></path>
                </svg>
              </span>
            </div>
            <div className="social-box social-box3"></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .social-card {
          position: relative;
          width: 180px;
          height: 180px;
          background: lightgrey;
          border-radius: 25px;
          overflow: hidden;
          box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
          transition: all 1s ease-in-out;
          cursor: pointer;
        }

        .social-card-background {
          position: absolute;
          inset: 0;
          background: var(--card-bg);
        }

        .social-card-logo {
          position: absolute;
          right: 50%;
          bottom: 50%;
          transform: translate(50%, 50%);
          transition: all 0.6s ease-in-out;
        }

        .social-card-logo-svg {
          fill: white;
          width: 28px;
          height: 28px;
        }

        .social-icon {
          display: inline-block;
          width: 18px;
          height: 18px;
        }

        .social-icon .social-svg {
          fill: rgba(255, 255, 255, 0.9);
          width: 100%;
          transition: all 0.5s ease-in-out;
        }

        .social-box {
          position: absolute;
          padding: 9px;
          text-align: right;
          background: rgba(255, 255, 255, 0.3);
          border-top: 2px solid rgb(255, 255, 255);
          border-right: 1px solid white;
          border-radius: 10% 13% 42% 0%/10% 12% 75% 0%;
          box-shadow: rgba(100, 100, 111, 0.364) -7px 7px 29px 0px;
          transform-origin: bottom left;
          transition: all 1s ease-in-out;
        }

        .social-box::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          opacity: 0;
          transition: all 0.5s ease-in-out;
        }

        .social-box:hover .social-svg {
          fill: white;
        }

        .social-box1 {
          width: 65%;
          height: 65%;
          bottom: -65%;
          left: -65%;
        }

        .social-box1::before {
          background: var(--card-bg);
        }

        .social-box1:hover::before {
          opacity: 1;
        }

        .social-box1:hover .social-icon .social-svg {
          filter: drop-shadow(0 0 5px white);
        }

        .social-box2 {
          width: 45%;
          height: 45%;
          bottom: -45%;
          left: -45%;
          transition-delay: 0.2s;
        }

        .social-box2::before {
          background: var(--card-bg);
        }

        .social-box2:hover::before {
          opacity: 1;
        }

        .social-box2:hover .social-icon .social-svg {
          filter: drop-shadow(0 0 5px white);
        }

        .social-box3 {
          width: 25%;
          height: 25%;
          bottom: -25%;
          left: -25%;
          transition-delay: 0.4s;
        }

        .social-box3::before {
          background: var(--card-bg);
        }

        .social-box3:hover::before {
          opacity: 1;
        }

        .social-card:hover {
          transform: scale(1.08);
        }

        .social-card:hover .social-box {
          bottom: -2px;
          left: -2px;
        }

        .social-card:hover .social-card-logo {
          transform: translate(0, 0);
          bottom: 18px;
          right: 18px;
        }
      `}</style>
    </>
  )
}
