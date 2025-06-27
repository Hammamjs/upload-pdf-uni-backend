import AsyncHandler from 'express-async-handler';
import puppeteer from 'puppeteer'; // ✅ updated import
import { parseResult } from '../utils/parseResult.js';
import AppError from '../utils/AppError.js';
import axios from 'axios';
import * as cheerio from 'cheerio';

export const studentResult = AsyncHandler(async (req, res, next) => {
  const studentIdx = req.student.studentIdx;
  try {
    // 1. First GET request to get any required cookies/tokens
    const getResponse = await axios.get(process.env.UNIVERSITY_URI);
    const cookies = getResponse.headers['set-cookie'] || [];

    // 2. Prepare form submission
    const formData = new URLSearchParams();
    formData.append('studentID', studentIdx);

    // 3. POST request with form data
    const postResponse = await axios.post(
      process.env.UNIVERSITY_URI + '?type=HOME',
      formData.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Cookie: cookies.join('; '),
          Referer: process.env.UNIVERSITY_URI,
        },
        maxRedirects: 0, // Handle redirects manually if needed
      }
    );

    // 4. Parse the response with Cheerio
    const $ = cheerio.load(postResponse.data);
    const resultText = $('div#page').text() || $('body').text();

    // 5. Process and return the result
    res.status(200).json({
      message: 'Result retrieved',
      res: parseResult(resultText),
    });
  } catch (err) {
    console.error('Error:', {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status,
    });
    return next(new AppError(400, 'Failed to retrieve result'));
  }
});
