import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    open: true,
    watch: {
      ignored: ['**/node_modules/**', '**/.git/**', '**/dist/**', '**/.wasp/**']
    }
  },
})
