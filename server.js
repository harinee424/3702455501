const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

const WINDOW_SIZE = 10;
const storedNumbers = new Set(); // stores unique numbers
let numberQueue = []; // keeps order for sliding window

const VALID_IDS = ['p', 'f', 'e', 'r'];
const TEST_SERVER = 'http://20.244.56.144/test'; // Replace with actual test API

// Utility to fetch from server with timeout (500ms)
const fetchNumbers = async (id) => {
  try {
    const source = axios.CancelToken.source();
    const timeout = setTimeout(() => source.cancel(), 500);

    const res = await axios.get(`${TEST_SERVER}/numbers/${id}`, {
      cancelToken: source.token,
    });
    clearTimeout(timeout);
    return res.data.numbers || [];
  } catch (err) {
    return []; // timeout or error
  }
};

app.get('/numbers/:numberid', async (req, res) => {
  const { numberid } = req.params;

  if (!VALID_IDS.includes(numberid)) {
    return res.status(400).json({ error: 'Invalid number ID' });
  }

  const before = Array.from(numberQueue);

  const newNumbers = await fetchNumbers(numberid);
  const uniqueNew = newNumbers.filter(num => !storedNumbers.has(num));

  for (let num of uniqueNew) {
    if (numberQueue.length >= WINDOW_SIZE) {
      const removed = numberQueue.shift();
      storedNumbers.delete(removed);
    }
    numberQueue.push(num);
    storedNumbers.add(num);
  }

  const after = Array.from(numberQueue);
  const average = after.length > 0
  ? parseFloat((after.reduce((a, b) => a + b, 0) / after.length).toFixed(2))
  : 0.00;


  return res.json({
    windowPrevState: before,
    windowCurrState: after,
    numbers: uniqueNew,
    avg: average,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
