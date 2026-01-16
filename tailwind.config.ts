import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class", // Force class-based dark mode instead of media query
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
};

export default config;
