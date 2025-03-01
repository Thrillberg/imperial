import { defineConfig } from 'vite'
import RubyPlugin from 'vite-plugin-ruby'
import vue from '@vitejs/plugin-vue'
import viteCompression from 'vite-plugin-compression';
import svgLoader from 'vite-svg-loader'

export default defineConfig({
  plugins: [
    RubyPlugin(),
    vue(),
    svgLoader(),
    viteCompression(),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler'
      }
    }
  }
})
