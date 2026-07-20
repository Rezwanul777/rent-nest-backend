import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/server.ts'], // Your main entry point
  format: ['esm','cjs'], // or ['esm', 'cjs'] for dual format
  dts: true, // Generate TypeScript declarations
  clean: true, // Clean dist/ before build
  external: ['express', 'dotenv'], // Don't bundle dependencies
  platform: 'node',
  target: 'node24', // Or your minimum Node.js version
})  