module.exports = {
  content: {
    // Specify the content source files
    files: ['./src/**/*.html', './src/**/*.vue', './src/**/*.js'],
  },

  plugins: [
    require('@tailwindcss/typography'),
    // Other plugins
  ],

  theme: {
    extend: {
      colors: {
        profile: '#9A0000',
        primary: '#E6C895',
        secondary: '#81180C',
      },

      fontFamily: {
        sans: ['Roboto Condensed', 'sans-serif'],
        serif: ['Cormorant Upright', 'serif'],
        segoe: ['Segoe UI', 'sans-serif'],
        roman: ['Times New Roman', 'serif'],
        cinzel: ['Cinzel', 'serif'],
      },
    },
  },
};
