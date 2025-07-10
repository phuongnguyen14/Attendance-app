/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        // Cyberpunk Color Palette
        cyber: {
          // Neon Colors
          neon: {
            pink: '#ff0080',
            cyan: '#00ffff',
            green: '#00ff41',
            purple: '#8000ff',
            blue: '#0040ff',
            yellow: '#ffff00',
            orange: '#ff8000',
            red: '#ff0040',
          },
          // Dark Backgrounds
          dark: {
            100: '#0a0a0f',
            200: '#0f0f23',
            300: '#1a1a2e',
            400: '#16213e',
            500: '#0f3460',
            600: '#533a7b',
            700: '#4a5568',
            800: '#2d3748',
            900: '#1a202c',
          },
          // Accent Colors
          accent: {
            electric: '#00e5ff',
            matrix: '#00ff00',
            plasma: '#ff00ff',
            energy: '#ffff00',
            neural: '#ff6b35',
          }
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        // Cyberpunk Animations
        'glow-pulse': 'glowPulse 2s ease-in-out infinite alternate',
        'neon-flicker': 'neonFlicker 1.5s ease-in-out infinite',
        'matrix-rain': 'matrixRain 3s linear infinite',
        'cyber-float': 'cyberFloat 3s ease-in-out infinite',
        'data-stream': 'dataStream 2s ease-in-out infinite',
        'hologram': 'hologram 4s ease-in-out infinite',
        'scan-line': 'scanLine 2s linear infinite',
        'electric-border': 'electricBorder 1s ease-in-out infinite alternate',
        'cyber-breathe': 'cyberBreathe 3s ease-in-out infinite',
        'plasma-flow': 'plasmaFlow 4s ease-in-out infinite',
        'neural-network': 'neuralNetwork 5s ease-in-out infinite',
        'quantum-shift': 'quantumShift 2s ease-in-out infinite',
        'digital-glitch': 'digitalGlitch 0.3s ease-in-out infinite',
        'cyber-spin': 'cyberSpin 1s linear infinite',
        'icon-hover': 'iconHover 0.3s ease-out',
        'button-cyber': 'buttonCyber 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        // Cyberpunk Keyframes
        glowPulse: {
          '0%': { 
            boxShadow: '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor',
            filter: 'brightness(1)'
          },
          '100%': { 
            boxShadow: '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor',
            filter: 'brightness(1.2)'
          },
        },
        neonFlicker: {
          '0%, 100%': { opacity: '1' },
          '10%': { opacity: '0.8' },
          '20%': { opacity: '1' },
          '30%': { opacity: '0.7' },
          '40%': { opacity: '1' },
          '60%': { opacity: '0.9' },
          '80%': { opacity: '1' },
        },
        matrixRain: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateY(100vh)', opacity: '0' },
        },
        cyberFloat: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-10px) rotate(1deg)' },
          '66%': { transform: 'translateY(-5px) rotate(-1deg)' },
        },
        dataStream: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        hologram: {
          '0%, 100%': { 
            opacity: '0.8',
            filter: 'hue-rotate(0deg) brightness(1)',
          },
          '25%': { 
            opacity: '0.9',
            filter: 'hue-rotate(90deg) brightness(1.1)',
          },
          '50%': { 
            opacity: '1',
            filter: 'hue-rotate(180deg) brightness(1.2)',
          },
          '75%': { 
            opacity: '0.9',
            filter: 'hue-rotate(270deg) brightness(1.1)',
          },
        },
        scanLine: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        electricBorder: {
          '0%': { 
            borderColor: '#00ffff',
            boxShadow: '0 0 5px #00ffff, inset 0 0 5px #00ffff',
          },
          '100%': { 
            borderColor: '#ff0080',
            boxShadow: '0 0 15px #ff0080, inset 0 0 10px #ff0080',
          },
        },
        cyberBreathe: {
          '0%, 100%': { 
            transform: 'scale(1)',
            filter: 'brightness(1) saturate(1)',
          },
          '50%': { 
            transform: 'scale(1.05)',
            filter: 'brightness(1.2) saturate(1.3)',
          },
        },
        plasmaFlow: {
          '0%': { 
            background: 'linear-gradient(45deg, #ff0080, #00ffff)',
          },
          '25%': { 
            background: 'linear-gradient(135deg, #00ffff, #8000ff)',
          },
          '50%': { 
            background: 'linear-gradient(225deg, #8000ff, #00ff41)',
          },
          '75%': { 
            background: 'linear-gradient(315deg, #00ff41, #ff0080)',
          },
          '100%': { 
            background: 'linear-gradient(45deg, #ff0080, #00ffff)',
          },
        },
        neuralNetwork: {
          '0%, 100%': { 
            opacity: '0.3',
            transform: 'scale(1) rotate(0deg)',
          },
          '33%': { 
            opacity: '0.7',
            transform: 'scale(1.1) rotate(120deg)',
          },
          '66%': { 
            opacity: '0.5',
            transform: 'scale(0.9) rotate(240deg)',
          },
        },
        quantumShift: {
          '0%, 100%': { 
            filter: 'hue-rotate(0deg) blur(0px)',
            transform: 'translateX(0px)',
          },
          '25%': { 
            filter: 'hue-rotate(90deg) blur(1px)',
            transform: 'translateX(2px)',
          },
          '50%': { 
            filter: 'hue-rotate(180deg) blur(0px)',
            transform: 'translateX(0px)',
          },
          '75%': { 
            filter: 'hue-rotate(270deg) blur(1px)',
            transform: 'translateX(-2px)',
          },
        },
        digitalGlitch: {
          '0%, 100%': { 
            transform: 'translate(0)',
            filter: 'hue-rotate(0deg)',
          },
          '20%': { 
            transform: 'translate(-2px, 2px)',
            filter: 'hue-rotate(90deg)',
          },
          '40%': { 
            transform: 'translate(-2px, -2px)',
            filter: 'hue-rotate(180deg)',
          },
          '60%': { 
            transform: 'translate(2px, 2px)',
            filter: 'hue-rotate(270deg)',
          },
          '80%': { 
            transform: 'translate(2px, -2px)',
            filter: 'hue-rotate(360deg)',
          },
        },
        cyberSpin: {
          '0%': { 
            transform: 'rotate(0deg) scale(1)',
            filter: 'hue-rotate(0deg)',
          },
          '50%': { 
            transform: 'rotate(180deg) scale(1.1)',
            filter: 'hue-rotate(180deg)',
          },
          '100%': { 
            transform: 'rotate(360deg) scale(1)',
            filter: 'hue-rotate(360deg)',
          },
        },
        iconHover: {
          '0%': { 
            transform: 'scale(1) rotateY(0deg)',
            filter: 'brightness(1)',
          },
          '50%': { 
            transform: 'scale(1.2) rotateY(180deg)',
            filter: 'brightness(1.5)',
          },
          '100%': { 
            transform: 'scale(1.1) rotateY(360deg)',
            filter: 'brightness(1.3)',
          },
        },
        buttonCyber: {
          '0%': { 
            transform: 'scale(1)',
            boxShadow: '0 0 0 rgba(0, 255, 255, 0)',
          },
          '50%': { 
            transform: 'scale(1.05)',
            boxShadow: '0 0 20px rgba(0, 255, 255, 0.5)',
          },
          '100%': { 
            transform: 'scale(1.02)',
            boxShadow: '0 0 10px rgba(0, 255, 255, 0.3)',
          },
        },
      },
      fontFamily: {
        'cyber': ['Orbitron', 'monospace'],
        'matrix': ['Fira Code', 'monospace'],
        'digital': ['Share Tech Mono', 'monospace'],
      },
      boxShadow: {
        'cyber-glow': '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor',
        'neon-pink': '0 0 10px #ff0080, 0 0 20px #ff0080, 0 0 30px #ff0080',
        'neon-cyan': '0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff',
        'neon-green': '0 0 10px #00ff41, 0 0 20px #00ff41, 0 0 30px #00ff41',
        'electric': '0 0 5px #00e5ff, 0 0 10px #00e5ff, 0 0 20px #00e5ff, 0 0 40px #00e5ff',
      },
      backdropBlur: {
        'cyber': '12px',
      },
    },
  },
  plugins: [],
};