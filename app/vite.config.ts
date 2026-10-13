/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import pkg from './package.json'

// base は相対パス: GitHub Pages のサブパス（/<repo>/）でも、ローカル preview でも同じビルドで動く
export default defineConfig({
  base: './',
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'prompt', // 更新は「更新」ボタンで反映（シミュレーター中に勝手に再読込しない）
      injectRegister: false,
      includeAssets: ['favicon.png', 'apple-touch-icon.png', 'icons/*.png'],
      manifest: {
        id: './',
        name: 'Pump On ! — CPB英会話シミュレーター',
        short_name: 'Pump On !',
        description:
          '人工心肺（CPB）中の英会話を、手術の流れに沿って疑似体験しながら学ぶ臨床工学技士向けトレーニング',
        lang: 'ja',
        dir: 'ltr',
        start_url: './',
        scope: './',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#0B1F3A',
        theme_color: '#0B1F3A',
        categories: ['education', 'medical'],
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,webmanifest}'],
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
      },
      devOptions: { enabled: false },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        // ライブラリ・教材・アプリ本体を分けて、教材だけ更新したときもライブラリのキャッシュを使い回す
        manualChunks(id) {
          if (id.includes('node_modules')) return 'vendor'
          if (id.includes('/src/content/')) return 'content'
          return undefined
        },
      },
    },
  },
  server: { host: '127.0.0.1', port: 5173 },
  preview: { host: '127.0.0.1', port: 4173 },
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
  },
})
