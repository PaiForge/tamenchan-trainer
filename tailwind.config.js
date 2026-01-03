module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                background: "var(--color-background)",
                surface: "var(--color-surface)",
                primary: "var(--color-primary)",
                "primary-dark": "var(--color-primary-dark)",
                text: "var(--color-text)",
                "text-muted": "var(--color-text-muted)",
                border: "var(--color-border)",
            },
        },
    },
    plugins: [],
}
