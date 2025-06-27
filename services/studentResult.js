import AsyncHandler from 'express-async-handler';
import puppeteer, { executablePath } from 'puppeteer'; // ✅ updated import
import { parseResult } from '../utils/parseResult.js';
import AppError from '../utils/AppError.js';

export const studentResult = AsyncHandler(async (req, res, next) => {
  const studentIdx = req.student.studentIdx;

  try {
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: executablePath(),
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
      ],
    });

    const page = await browser.newPage();
    await page.goto(process.env.UNIVERSITY_URI, {
      waitUntil: 'domcontentloaded',
      timeout: 0,
    });

    await page.waitForSelector('input[name="studentID"]', {
      visible: true,
      timeout: 10000,
    });
    await page.type('input[name="studentID"]', studentIdx);

    await page.waitForSelector('button[name=""]', {
      visible: true,
      timeout: 10000,
    });
    await page.click('button[name=""]');

    await page.waitForSelector('div#page', {
      visible: true,
      timeout: 20000,
    });

    const result = await page.evaluate(() => document.body.innerText);
    await browser.close();

    res
      .status(200)
      .json({ message: 'Result retrieved', res: parseResult(result) });
  } catch (err) {
    console.error('Puppeteer error:', err); // Add this for better debugging
    return next(new AppError(400, 'Something went wrong'));
  }
});
