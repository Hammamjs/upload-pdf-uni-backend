import AsyncHandler from 'express-async-handler';
import puppeteer from 'puppeteer-core';
import { parseResult } from '../utils/parseResult.js';

export const studentResult = AsyncHandler(async (req, res, next) => {
  const studentIdx = req.student.studentIdx;

  try {
    const browser = await puppeteer.launch({
      channel: 'chrome',
      headless: true,
      timeout: 60000,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage', // Reduces memory usage
      ],
    });

    const page = await browser.newPage();
    await page.goto(process.env.UNIVERSITY_URI, {
      waitUntil: 'domcontentloaded',
      timeout: 0,
    });

    // Fill form and submit
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

    // Wait for result to appear (no navigation)
    await page.waitForSelector('div#page', { visible: true, timeout: 20000 }); // Replace with actual selector

    const result = await page.evaluate(() => document.body.innerText);
    await browser.close();
    res
      .status(200)
      .json({ message: 'Result retrived', res: parseResult(result) });
  } catch (err) {
    console.log(err);
    return res.status(500);
  }
});
