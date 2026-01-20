'use client'

export function SocialCards() {
  return (
    <>
      <div className="mt-16 pt-12 border-t border-white/20">
        <h3 className="text-2xl font-bold text-center mb-8 text-white">Follow Our Church</h3>
        <div className="flex justify-center">
          <div className="social-cards-container">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <svg className="socialSvg" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.6l-5.165-6.75-5.9 6.75h-3.306l7.73-8.835L.966 2.25h6.74l4.888 6.469L17.56 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
              </svg>
              <svg className="socialSvg" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.6l-5.165-6.75-5.9 6.75h-3.306l7.73-8.835L.966 2.25h6.74l4.888 6.469L17.56 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
              </svg>
            </a>

            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <svg className="socialSvg" viewBox="0 0 448 512">
                <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"></path>
              </svg>
              <svg className="socialSvg" viewBox="0 0 448 512">
                <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"></path>
              </svg>
            </a>

            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <svg className="socialSvg" viewBox="0 0 24 24">
                <path d="M18 2h-3a6 6 0 0 0-6 6v3H7v4h2v8h4v-8h3l1-4h-4V8a1 1 0 0 1 1-1h3z"></path>
              </svg>
              <svg className="socialSvg" viewBox="0 0 24 24">
                <path d="M18 2h-3a6 6 0 0 0-6 6v3H7v4h2v8h4v-8h3l1-4h-4V8a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>

            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <svg className="socialSvg" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"></path>
              </svg>
              <svg className="socialSvg" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        .social-cards-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 32px;
          padding: 24px 32px;
          background: rgba(49, 49, 49, 0.8);
          border-radius: 16px;
          backdrop-filter: blur(10px);
          width: fit-content;
        }

        .social-link {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .social-link:nth-child(1) {
          background: linear-gradient(45deg, #000000, #333333);
        }

        .social-link:nth-child(2) {
          background: linear-gradient(45deg, #0077b5, #00a0dc);
        }

        .social-link:nth-child(3) {
          background: linear-gradient(45deg, #1877f2, #42b72a);
        }

        .social-link:nth-child(4) {
          background: linear-gradient(45deg, #ff0000, #cc0000);
        }

        .social-link .socialSvg {
          width: 20px;
          height: 20px;
          fill: white;
          position: absolute;
          transition: all 0.3s ease;
        }

        .social-link .socialSvg:first-child {
          opacity: 1;
          transform: scale(1);
        }

        .social-link .socialSvg:last-child {
          opacity: 0;
          transform: scale(0);
        }

        .social-link:hover {
          transform: scale(1.2);
        }

        .social-link:nth-child(1):hover {
          transform: translateY(-6px) scale(1.2);
        }

        .social-link:nth-child(2):hover {
          transform: translateY(6px) scale(1.2);
        }

        .social-link:nth-child(3):hover {
          transform: translateY(-6px) scale(1.2);
        }

        .social-link:nth-child(4):hover {
          transform: translateY(6px) scale(1.2);
        }

        .social-link:hover .socialSvg:first-child {
          opacity: 0;
          transform: scale(0);
        }

        .social-link:hover .socialSvg:last-child {
          opacity: 1;
          transform: scale(1);
        }

        @media (max-width: 640px) {
          .social-cards-container {
            gap: 16px;
            padding: 20px 24px;
          }

          .social-link {
            width: 44px;
            height: 44px;
          }

          .social-link .socialSvg {
            width: 18px;
            height: 18px;
          }
        }
      `}</style>
    </>
  )
}
