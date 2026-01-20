"use client"

import { useTheme } from "@/contexts/theme-context"
import { useEffect, useState } from "react"

export function ModeToggle() {
  const { theme, updateTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const toggle = () => updateTheme({ darkMode: !theme.darkMode })

  const checked = mounted ? theme.darkMode : true // Default to true for dark mode

  return (
    <div className="flex items-center" aria-label="Toggle dark mode">
      <input
        className="theme-toggle-switch"
        id="toggle-theme"
        type="checkbox"
        checked={checked}
        onChange={toggle}
      />
      <style jsx>{`
        .theme-toggle-switch {
          display: block;
          cursor: pointer;
          background-color: rgba(0, 0, 0, 0.7);
          border-radius: 0.75em;
          box-shadow: 0.125em 0.125em 0 0.125em rgba(0, 0, 0, 0.3) inset;
          color: #fdea7b;
          display: inline-flex;
          align-items: center;
          margin: 0;
          padding: 0.15em;
          width: 3em;
          height: 1.5em;
          transition:
            background-color 0.1s 0.3s ease-out,
            box-shadow 0.1s 0.3s ease-out;
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
        }

        .theme-toggle-switch:before,
        .theme-toggle-switch:after {
          content: "";
          display: block;
        }

        .theme-toggle-switch:before {
          background-color: #d7d7d7;
          border-radius: 50%;
          width: 1.2em;
          height: 1.2em;
          transition:
            background-color 0.1s 0.3s ease-out,
            transform 0.3s ease-out;
          z-index: 1;
        }

        .theme-toggle-switch:after {
          background:
            linear-gradient(transparent 50%, rgba(0, 0, 0, 0.15) 0) 0 50% / 50% 100%,
            repeating-linear-gradient(90deg, #bbb 0, #bbb, #bbb 20%, #999 20%, #999 40%)
              0 50% / 50% 100%,
            radial-gradient(circle at 50% 50%, #888 25%, transparent 26%);
          background-repeat: no-repeat;
          border: 0.25em solid transparent;
          border-left: 0.4em solid #d8d8d8;
          border-right: 0 solid transparent;
          transition:
            border-left-color 0.1s 0.3s ease-out,
            transform 0.3s ease-out;
          transform: translateX(-22.5%);
          transform-origin: 25% 50%;
          width: 1.2em;
          height: 1em;
          box-sizing: border-box;
        }

        /* Checked (Dark Mode) */
        .theme-toggle-switch:checked {
          background-color: rgba(0, 0, 0, 0.45);
          box-shadow: 0.125em 0.125em 0 0.125em rgba(0, 0, 0, 0.1) inset;
        }

        .theme-toggle-switch:checked:before {
          background-color: currentColor;
          transform: translateX(125%);
        }

        .theme-toggle-switch:checked:after {
          border-left-color: currentColor;
          transform: translateX(-2.5%) rotateY(180deg);
        }

        /* Focus State */
        .theme-toggle-switch:focus {
          outline: 2px solid rgba(147, 197, 253, 0.5);
          outline-offset: 2px;
        }
      `}</style>
    </div>
  )
}
