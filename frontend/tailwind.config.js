module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                'gray-bg': '#1a1c23',
                'black-behind': '#121317',
                'light-behind': '#f9fafb',
                'gray-text': '#9e9e9e'
            },
            keyframes: {
                wave: {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' }
                },
                typing: {
                    '0%, 100%': {
                        width: 0
                    },
                    '50% ,90%': {
                        width: '100%'
                    }
                },
                effect: {
                    '0%': {
                        transform: 'scale(0.5)',
                        opacity: 0
                    },
                    '100%': {
                        transform: 'scale(1)',
                        opacity: 1
                    }
                }
            },
            animation: {
                'waving-hand': 'wave 1s linear infinite',
                typing: 'typing 6s steps(40) infinite',
                effectt: 'effect .3s linear'
            },
            fontFamily: {
                nikeFutura: 'Nike Futura'
            }
        }
    },
    plugins: [],
    corePlugins: {
        preflight: false
    }
};
