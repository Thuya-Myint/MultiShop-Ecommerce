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
                whitev2: '#dedede',
                lagoon: '#FDD037',
                whitev3: '#d8d8d8'
            }
        },
    },
    plugins: [],
}
