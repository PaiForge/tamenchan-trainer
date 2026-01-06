import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        server: {
            deps: {
                inline: ['@pai-forge/riichi-mahjong'],
            },
        },
    },
});
