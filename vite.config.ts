import {defineConfig} from 'vite';
import {createRequire} from 'node:module';

const require = createRequire(import.meta.url);
const {default: motionCanvas} = require('@motion-canvas/vite-plugin');

export default defineConfig({
  plugins: [motionCanvas()],
});
