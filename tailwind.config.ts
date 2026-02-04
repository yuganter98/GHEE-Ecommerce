import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                ghee: {
                    50: '#fffbf0',
                    100: '#fff4cc',
                    200: '#ffea99',
                    300: '#ffdb5c',
                    400: '#ffc829',
                    500: '#f5b700', // Primary Ghee Gold
                    600: '#d18e00',
                    700: '#a66600',
                    800: '#8c5208',
                    900: '#75430d',
                    950: '#422202',
                },
            },
            fontFamily: {
                serif: ['var(--font-playfair)', 'serif'],
                sans: ['var(--font-inter)', 'sans-serif'],
            },
            height: {
                'screen-dvh': '100dvh',
            }
        },
    },
    plugins: [],
};
export default config;
