require('dotenv').config();
const express = require('express');
const cors = require('cors')
const connectDB = require('./config/database')

const app = express();


// Middleware
app.use(cors());
app.use(express.json());


// DB connection
connectDB();

app.get('/',(req,res)=>{
res.send("IntelliInvoice server is running")
})

const PORT = process.env.PORT || 5000;
app.listen(PORT,() => {
    console.log(`Server is running on the port ${PORT}`);
})