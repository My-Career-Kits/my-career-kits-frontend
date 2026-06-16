// import type { Config } from "tailwindcss";

// const config: Config = {
//   darkMode: "class",
//   content: [
//     "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
//   ],
//   theme: {
//     extend: {
//       colors: {
//         background: "var(--background)",
//         surface: "var(--surface)",
//         "surface-elevated": "var(--surface-elevated)",
//         border: "var(--border)",
//         "border-bright": "var(--border-bright)",
//         accent: "var(--accent)",
//         "accent-glow": "var(--accent-glow)",
//         "accent-dark": "var(--accent-dark)",
//         success: "var(--success)",
//         warning: "var(--warning)",
//         danger: "var(--danger)",
//         "text-primary": "var(--text-primary)",
//         "text-secondary": "var(--text-secondary)",
//         "text-tertiary": "var(--text-tertiary)",
//       },
//       fontFamily: {
//         sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
//         mono: ["var(--font-geist-mono)", "monospace"],
//       },
//       animation: {
//         shimmer: "shimmer 1.5s infinite",
//         float: "float 6s ease-in-out infinite",
//         "pulse-glow": "pulse-glow 2s ease-in-out infinite",
//       },
//       keyframes: {
//         shimmer: {
//           "0%": { backgroundPosition: "-200% 0" },
//           "100%": { backgroundPosition: "200% 0" },
//         },
//         float: {
//           "0%, 100%": { transform: "translateY(0px)" },
//           "50%": { transform: "translateY(-20px)" },
//         },
//         "pulse-glow": {
//           "0%, 100%": { boxShadow: "0 0 20px rgba(0,194,255,0.3)" },
//           "50%": { boxShadow: "0 0 40px rgba(0,194,255,0.5)" },
//         },
//       },
//     },
//   },
//   plugins: [],
// };

// export default config;


















import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-outfit)", "sans-serif"],
      },
      colors: {
        background: "var(--background)",
        surface: "var(--surface)",
        "surface-elevated": "var(--surface-elevated)",
        border: "var(--border)",
        "border-bright": "var(--border-bright)",
        accent: "var(--accent)",
        "accent-dark": "var(--accent-dark)",
        success: "var(--success)",
        warning: "var(--warning)",
        danger: "var(--danger)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-tertiary": "var(--text-tertiary)",
      },
    },
  },
  plugins: [],
};

export default config;
