export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@nuxt/image-edge', '@nuxtjs/color-mode'],
  colorMode: {
    preference: 'acid',
    dataValue: 'theme',
    classSuffix: '',
  },
})
