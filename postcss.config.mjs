/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {}, // Ensures TailwindCSS is loaded
    autoprefixer: {}, // Automatically adds vendor prefixes
  },
};

export default config;