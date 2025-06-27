import { join } from 'path';
import { cwd } from 'process';
/**
 * @type {import('puppeteer').Configuration}
 */
module.exports = { cachedDirectory: join(__dirname, '.cache', 'puppeteer') };

export default {
  cachedDirectory: join(cwd(), '.cache', 'puppeteer'),
};
