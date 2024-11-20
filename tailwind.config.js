/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],       //configurando os arquivos que irão utilizar o tailwindcss
  theme: {
    extend: {
      backgroundImage:{
        "home": "url('/assets/bg.png')"
      }
    },
  },
  plugins: [],
}

