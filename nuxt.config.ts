import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@pinia/nuxt',
    'nuxt-svgo',
    '@nuxt/image',
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  css: ['~/assets/css/main.css'],

  // Icons: same pattern as iberia_new
  svgo: {
    global: false,
    defaultImport: 'component',
    customComponent: 'Icon',
    dts: true,
  },

  // Image optimization (Cloudinary via Strapi)
  image: {
    quality: 80,
    format: ['webp'],
  },

  runtimeConfig: {
    strapiToken: process.env.STRAPI_TOKEN ?? '',
    revalidateSecret: process.env.REVALIDATE_SECRET ?? '',
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL ?? 'https://kuchkuchi.ge',
      strapiUrl: process.env.STRAPI_URL ?? 'http://localhost:1337',
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'ka' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#d97706' },
        { name: 'robots', content: 'index, follow' },
      ],
      link: [
        { rel: 'icon', type: 'image/jpeg', href: 'https://res.cloudinary.com/dketlufwl/image/upload/c_fill,w_32,h_32,r_max/v1775286358/kutch_kutchi_logo_60cm_b96b40d732.jpg' },
        { rel: 'apple-touch-icon', href: 'https://res.cloudinary.com/dketlufwl/image/upload/c_fill,w_180,h_180,r_max/v1775286358/kutch_kutchi_logo_60cm_b96b40d732.jpg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' as const },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap',
        },
      ],
    },
    layoutTransition: { name: 'fade', mode: 'out-in' },
    pageTransition: { name: 'fade', mode: 'out-in' },
  },
})
