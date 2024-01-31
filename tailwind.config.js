/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'hero-pattern': "url('/assets/tesla_model_s_black-wallpaper-1600x900.jpg')"
      }
    },
  },
  plugins: [],

}

