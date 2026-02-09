/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./public/index.html"
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Nunito', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
                display: ['Fredoka', 'Nunito', 'sans-serif'],
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 4px)',
                sm: 'calc(var(--radius) - 8px)',
                xl: 'var(--radius-lg)',
                '2xl': 'var(--radius-xl)',
                '3xl': '1.75rem',
                'full': 'var(--radius-full)',
            },
            colors: {
                background: 'hsl(var(--background))',
                'background-soft': 'hsl(var(--background-soft))',
                foreground: 'hsl(var(--foreground))',
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))',
                    elevated: 'hsl(var(--card-elevated))',
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))',
                },
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    light: 'hsl(var(--primary-light))',
                    dark: 'hsl(var(--primary-dark))',
                    foreground: 'hsl(var(--primary-foreground))',
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    light: 'hsl(var(--secondary-light))',
                    foreground: 'hsl(var(--secondary-foreground))',
                },
                tertiary: {
                    DEFAULT: 'hsl(var(--tertiary))',
                    light: 'hsl(var(--tertiary-light))',
                    foreground: 'hsl(var(--tertiary-foreground))',
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))',
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    light: 'hsl(var(--accent-light))',
                    dark: 'hsl(var(--accent-dark))',
                    foreground: 'hsl(var(--accent-foreground))',
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))',
                },
                success: {
                    DEFAULT: 'hsl(var(--success))',
                    foreground: 'hsl(var(--success-foreground))',
                },
                warning: {
                    DEFAULT: 'hsl(var(--warning))',
                    foreground: 'hsl(var(--warning-foreground))',
                },
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                chart: {
                    '1': 'hsl(var(--chart-1))',
                    '2': 'hsl(var(--chart-2))',
                    '3': 'hsl(var(--chart-3))',
                    '4': 'hsl(var(--chart-4))',
                    '5': 'hsl(var(--chart-5))',
                },
            },
            boxShadow: {
                'cartoon': 'var(--shadow-cartoon)',
                'cartoon-sm': 'var(--shadow-cartoon-sm)',
                'cartoon-lg': 'var(--shadow-cartoon-lg)',
                'cartoon-primary': 'var(--shadow-cartoon-primary)',
                'cartoon-accent': 'var(--shadow-cartoon-accent)',
                'soft': 'var(--shadow-soft)',
                'elevated': 'var(--shadow-elevated)',
            },
            transitionTimingFunction: {
                'bounce': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
            },
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' },
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' },
                },
                'bounce-in': {
                    '0%': { opacity: '0', transform: 'scale(0.8) translateY(20px)' },
                    '50%': { transform: 'scale(1.05)' },
                    '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
                },
                'wiggle': {
                    '0%, 100%': { transform: 'rotate(-3deg)' },
                    '50%': { transform: 'rotate(3deg)' },
                },
                'pop': {
                    '0%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.15)' },
                    '100%': { transform: 'scale(1)' },
                },
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
                'bounce-in': 'bounce-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                'wiggle': 'wiggle 0.5s ease-in-out infinite',
                'pop': 'pop 0.3s ease-out',
            },
            spacing: {
                'safe-bottom': 'env(safe-area-inset-bottom, 0)',
                'safe-top': 'env(safe-area-inset-top, 0)',
            },
            borderWidth: {
                '3': '3px',
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};
