import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        contact: resolve(__dirname, 'src/pages/contact/contact.html'),
        map: resolve(__dirname, 'src/pages/map/map.html'),
        registration: resolve(__dirname, 'src/pages/registration/registration.html'),
      },
    },
  },
});