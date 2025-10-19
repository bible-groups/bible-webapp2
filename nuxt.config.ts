import tailwindcss from "@tailwindcss/vite";

// PWA 타입 선언
declare module '@nuxt/schema' {
  interface NuxtConfig {
    pwa?: any
  }
}

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: false },
  app: {
    head: {
      title: 'GSEED',
      meta: [
        { name: 'description', content: 'BIBLE STUDYS - 성경의 세계를 더 깊이 탐구하고 신앙 생활을 풍성하게' },
        { name: 'keywords', content: 'BIBLE STUDY, 성경, 묵상, 신앙, 기독교' },
        { name: 'author', content: 'BIBLE STUDY' },
        { name: 'robots', content: 'index, follow' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#3866ef' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        { name: 'apple-mobile-web-app-title', content: 'BIBLE STUDY' },
        { name: 'msapplication-TileColor', content: '#3866ef' },
        { name: 'msapplication-config', content: '/browserconfig.xml' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/bible-favicon.ico' },
        { rel: 'manifest', href: '/manifest.json' }
      ]
    },
  },
  // Firebase 설정
  runtimeConfig: {
    public: {
      firebaseApiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID,
    }
  },
  css: [
    '~/assets/scss/main.scss',
    '~/assets/css/tailwind.css',
    "font-awesome/css/font-awesome.min.css"
  ],
  plugins: [
    '~/plugins/firebase.js',
    '~/plugins/auth.client.js',
    '~/plugins/sw.client.js'
  ],
  modules: [     
    '@pinia/nuxt'
  ],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
});