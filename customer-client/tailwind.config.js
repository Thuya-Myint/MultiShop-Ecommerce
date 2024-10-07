/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                baseColor: '#ecebeb',
                customBluishPurple: '#5c4ccf',
                obsidian: '#262628',
                lavender: '#C6C3F2',
                cream: '#FFFGEF',
                lime: '#D6DC82',
                cherry: '#D96073',
                lionsmane: '#FCF3E4',
                gry: '#55545C',
                outline: '#75747b',
                whitev1: '#edeef1',
                pinkcustom: '#fc56a1',
                mochaIce: '#dfd1c9'
            }
        },
        screens: {
            'sm': '390px',
            'md': '960px',
            'xl': '1300px',
        }
    },
    plugins: [],
}
