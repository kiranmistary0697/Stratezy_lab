/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgBlack: "#151924",
        lightBlue: '#5C9DFF',
        lightGray: '#CFD1D4',
        switchBlueColor: '#3B82F6',
        switchGrayColor: '#E5E7EB',
        white: "#fff",
        placeholderGray: '#6B7280',
        lightPink: '#EADDFF',
        textColor: '#374151',
        fadeGray: '#F9FAFB',
        darkGray: '#E4E4E4',
        lightDark: '#9CA3AF',
        midGray: '#6F6C90',
        midDark: '#111827',
        mintColor: '#C0D5DE',
        fadeDark: '#313131',
        thickDark: '626262',
        lightGreen: '#2E6B2B',
        lightRed: '#A2030B',
        darkPurple: '#3F51B5',
        midGray: '#F3F4F6',
        stealGray: '#797d7a',
        lightBlue: "#4E78CA",
        primary: {
          DEFAULT: "#0A0A0A",
          white: "#FFFFFF",
          blue: {
            DEFAULT: "#3D69D3",
            hover: '#1E52CE'
          },
          green: "#0A994A",
          grey: "#E0E1E4"
        },
        secondary: {
          DEFAULT: "#666666"
        },
        footer: {
          dark: "#141A20",
        }
      },
      fontFamily: {
        inter: ['Inter'],
        lato: ['Lato'],
        montserrat: ['Montserrat'],
      },
      height: {
        navHeight: '86px',
        navHeightMobile: '66px',
      },
      minHeight: {
        footer: "454px",
      },
      maxWidth: {
        maxContent: "1440px",
      },
    },
  },
  plugins: [],
}

