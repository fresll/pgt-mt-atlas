import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: путь проекта на GitHub Pages (https://<owner>.github.io/pgt-mt-atlas/).
// Публикация отключена до явного решения авторов (docs/implementation_plan.md, раздел 7).
export default defineConfig({
  base: process.env.ATLAS_BASE ?? '/pgt-mt-atlas/',
  plugins: [react()],
  ssgOptions: {
    dirStyle: 'nested',
    // Plotly загружается только в браузере (см. components/PlotlyChart.tsx)
  },
  test: {
    include: ['src/**/*.test.ts'],
  },
} as never)
