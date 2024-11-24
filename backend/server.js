require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
const emailRoute = require ("./routes/emailRoutes")
import nodeCron from 'node-cron';
const createEmailParser  = require('./services/emailParser')

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// DB connection
connectDB();

app.get("/", (req, res) => {
  res.send("IntelliInvoice server is running");
});

app.use('/api/emails', emailRoute);
// app.use('/api/attachments', attachmentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on the port ${PORT}`);
});


// Schedule email fetching
const emailParser = createEmailParser();

nodeCron.schedule('*/5 * * * *', async () => {
  try {
    await emailParser.fetchEmails();
  } catch (error) {
    console.error('Scheduled email fetch failed:', error);
  }
});