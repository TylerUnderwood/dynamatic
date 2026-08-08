import { defineConfig } from 'vite'
import { resolve, relative, extname } from 'node:path'
import { readdirSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('.', import.meta.url))
const styles = resolve(root, 'src/styles')

/** Collect every .css file under a folder, skipping barrel index.css files */
function cssEntries(dir, prefix) {
  const entries = {}

  function walk(current) {
    for (const name of readdirSync(current)) {
      const full = resolve(current, name)
      if (statSync(full).isDirectory()) {
        walk(full)
        continue
      }
      if (!name.endsWith('.css') || name === 'index.css') continue

      // e.g. components/Card, components/shapes/Hexagon, utilities/misc
      const rel = relative(dir, full).replace(/\\/g, '/')
      const key = `${prefix}/${rel.slice(0, -extname(rel).length)}`
      entries[key] = full
    }
  }

  walk(dir)
  return entries
}

export default defineConfig({
  server: {
    open: 'preview.html',
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    cssCodeSplit: true,
    rollupOptions: {
      input: {
        // 1 file: everything under theme/index.css
        theme: resolve(styles, 'theme/index.css'),

        // 1 file: everything under core/index.css
        core: resolve(styles, 'core/index.css'),

        // 1 file per component CSS (not the barrel)
        ...cssEntries(resolve(styles, 'components'), 'components'),

        // 1 file per utility CSS
        ...cssEntries(resolve(styles, 'utilities'), 'utilities'),
      },
      output: {
        assetFileNames: (assetInfo) => {
          const name = assetInfo.names?.[0] ?? ''
          if (name.endsWith('.css')) {
            return 'styles/[name][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        },
      },
    },
  },
})
