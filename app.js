require('dotenv').config();
const axios = require("axios");
const express = require('express');
const connectDB = require('./utils/db');
const authRoutes = require('./routes/authRoutes');
const app = express();
app.use(express.json());
const cors = require('cors');

connectDB();

app.use(cors({
  origin: '*',
  // methods: ['GET', 'POST', 'PUT', 'DELETE'],
  // allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use('/api/auth', authRoutes);

(async () => {
  const res = await axios.get("https://api.ipify.org?format=json");
  console.log("Public IP Address:", res.data.ip);
})();


app.get('/', async (req, res) => {
  res.send('hello')
});


app.listen(5000, () => {
  console.log('Server running on port 5000');
});
