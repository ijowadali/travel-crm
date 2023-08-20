import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import Components from 'unplugin-vue-components/vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const { VITE_PORT } = env as ImportMetaEnv;

  const port = parseInt(VITE_PORT, 10);

  return {
    plugins: [
      vue(),
      Components({
        dts: './src/types/components.d.ts',
      }),
    ],
    resolve: {
      alias: [
        {
          find: '@src/',
          replacement: path.resolve(process.cwd(), 'src') + '/',
        },
      ],
    },
    server: {
      open: true,
      port,
    },
  };
});
