// puppeteer.config.mjs
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default {
  cacheDir: join(__dirname, '.cache', 'puppeteer'),
};
