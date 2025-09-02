/** @type {import('tailwindcss').Config} */
import forms from '@tailwindcss/forms'

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#EEE3FF", 
          600: "#8054C7",
          700: "#5A3696",
        },
        secondary: {
          600: "#63D838",
        },
      },
      boxShadow: {
        card: "0 1px 2px rgba(16,24,40,.05), 0 1px 3px rgba(16,24,40,.10)",
      },
      borderRadius: {
        '2xl': '1rem',
      },
    },
  },
  plugins: [forms()],
};
