import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    backgroundImage: {
      "gradient-grainy": "url('/img/gradient.jpeg')",
    },
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["cupcake"],
  }
} satisfies Config;
