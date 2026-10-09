const express = require('express');

const app = express();

app.use(express.json());


app.listen(3002, () => {
  console.log('Server is running on http://localhost:3002');
});