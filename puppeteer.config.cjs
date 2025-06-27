import { join } from 'path';
/**
 * @type {import('puppeteer').Configuration}
 */
module.exports = { cachedDirectory: join(__dirname, '.cache', 'puppeteer') };
