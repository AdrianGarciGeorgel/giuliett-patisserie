import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const raiz = fileURLToPath(new URL('./', import.meta.url))

export default defineConfig({
  test: {
    environment: 'node',
    include: ['test/**/*.test.{ts,tsx}'],
  },
  resolve: {
    alias: {
      '@': raiz,
      // `server-only` explota fuera de React Server Components. En tests no aplica.
      'server-only': `${raiz}test/stubs/server-only.ts`,
    },
  },
})
