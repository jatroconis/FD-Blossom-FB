import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'node',
        include: ['src/**/*.test.ts', 'src/**/__tests__/**/*.test.ts'],
        passWithNoTests: false
    },
    esbuild: {
        tsconfigRaw: {
            compilerOptions: { experimentalDecorators: true }
        }
    }
});