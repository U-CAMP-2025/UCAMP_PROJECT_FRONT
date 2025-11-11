import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import removeConsole from 'vite-plugin-remove-console';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  return {
    plugins: [
      react(),
      tsconfigPaths(),
      command === 'build' &&
        removeConsole({
          includes: ['log', 'warn', 'error'],
        }),
    ],
    server: {
      port: 3000,
    },
    resolve: {
      alias: [{ find: '@', replacement: '/src' }],
    },
  };
});
