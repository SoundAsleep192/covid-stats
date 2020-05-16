const express = require('express');
const cors = require('cors');
const app = express();

// middleware
app.use(cors());
app.use(express.json());

app.listen(8000, () => {
  console.log("Server is running");
})
