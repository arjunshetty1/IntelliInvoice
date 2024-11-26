const createEmailParser = require("../services/emailParser"); 
const { Email } = require("../models/Email"); 

const createEmailController = () => {
  const emailParser = createEmailParser();

  // Controller method to fetch new emails with attachments from the email server
  const fetchNewEmails = async (req, res) => {
    try {
      console.log('Attempting to fetch emails...'); 
      const emails = await emailParser.fetchEmails(); 
      console.log('Fetch emails result:', emails); 
      res.json({ success: true, count: emails.length, emails });
    } catch (error) {
      console.error('Full error in fetchNewEmails:', error); 
      res.status(500).json({ 
        success: false, 
        error: error.message || 'Unknown error occurred' 
      });
    }
  };

  // Controller method to get emails from the database with optional filters and pagination
  const getEmails = async (req, res) => {
    try {
      const { page = 1, limit = 10, hasInvoice } = req.query;
      const query = hasInvoice ? { hasInvoice: hasInvoice === "true" } : {}; // Filter for emails with or without invoices

      // Query the database for emails with optional pagination and filtering
      const emails = await Email.find(query)
        .sort({ date: -1 }) 
        .limit(limit * 1) 
        .skip((page - 1) * limit) 
        .exec();

      // Get the total count of emails for pagination
      const count = await Email.countDocuments(query);

      res.json({
        emails,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  return {
    fetchNewEmails,
    getEmails,
  };
};

module.exports = {
  createEmailController,
};
