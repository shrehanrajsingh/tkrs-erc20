/** @type {import('tailwindcss').Config} */
export default {
  content: ["index.html", "./src/**/*.{html, js, jsx, ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        agile: ["Agile", "sans-serif"],
      },
      keyframes: {
        wave: {
          "0%": {
            transform: "translateX(0px)",
          },
          "20%": {
            transform: "translateX(-20px)",
          },
          "60%": {
            transform: "translateX(+20px)",
          },
          "80%": {
            transform: "translateX(-20px)",
          },
          "100%": {
            transform: "translateX(0px)",
          },
        },
        float: {
          "0%": {
            transform: "translateY(0px) translateX(0px) rotate(0deg)",
          },
          "25%": {
            transform: "translateY(-5px) translateX(10px) rotate(5deg)",
          },
          "50%": {
            transform: "translateY(0px) translateX(0px) rotate(0deg)",
          },
          "75%": {
            transform: "translateY(5px) translateX(-10px) rotate(-5deg)",
          },
          "100%": {
            transform: "translateY(0px) translateX(0px) rotate(0deg)",
          },
        },
        float2: {
          "0%": {
            transform: "translateY(0px) translateX(0px) rotate(0deg)",
          },
          "25%": {
            transform: "translateY(5px) translateX(-10px) rotate(5deg)",
          },
          "50%": {
            transform: "translateY(0px) translateX(0px) rotate(0deg)",
          },
          "75%": {
            transform: "translateY(-5px) translateX(10px) rotate(-5deg)",
          },
          "100%": {
            transform: "translateY(0px) translateX(0px) rotate(0deg)",
          },
        },
      },
      animation: {
        "waving-obj": "wave 2s linear infinite",
        "floating-obj": "float 4s ease-in-out infinite",
        "floating-obj2": "float2 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
