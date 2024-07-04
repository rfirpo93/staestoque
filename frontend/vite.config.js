import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            'xlsx': require.resolve('xlsx')
        }
    },
    build: {
        rollupOptions: {
            external: ['xlsx']
        }
    }
});
