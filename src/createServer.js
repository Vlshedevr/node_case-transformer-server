/* eslint-disable max-len */
const http = require('node:http');
const { convertToCase } = require('./convertToCase');

const CASE_NAME = ['SNAKE', 'KEBAB', 'CAMEL', 'PASCAL', 'UPPER'];

function createServer() {
  const server = http.createServer((req, res) => {
    const [pathname, search] = req.url.split('?');

    const toCase = new URLSearchParams(search).get('toCase') || '';
    const text = pathname.slice(1);
    const falidate = {
      errors: [],
    };

    if (text.trim() === '') {
      falidate.errors.push({
        message:
          'Text to convert is required. Correct request is: "/<TEXT_TO_CONVERT>?toCase=<CASE_NAME>".',
      });
    }

    if (toCase === '') {
      falidate.errors.push({
        message:
          '"toCase" query param is required. Correct request is: "/<TEXT_TO_CONVERT>?toCase=<CASE_NAME>".',
      });
    } else if (!CASE_NAME.includes(toCase)) {
      falidate.errors.push({
        message:
          'This case is not supported. Available cases: SNAKE, KEBAB, CAMEL, PASCAL, UPPER.',
      });
    }

    if (falidate.errors.length !== 0) {
      res.statusCode = 400;
      res.setHeader('Content-type', 'application/json');
      res.statusMessage = 'Bad request';
      res.end(JSON.stringify(falidate));

      return;
    }

    const { originalCase, convertedText } = convertToCase(text, toCase);

    const result = {
      originalCase: originalCase,
      targetCase: toCase,
      originalText: text,
      convertedText: convertedText,
    };

    res.statusCode = 200;
    res.setHeader('Content-type', 'application/json');
    res.statusMessage = 'OK';
    res.end(JSON.stringify(result));
  });

  return server;
}

module.exports = {
  createServer,
};
