const createEmailParser = require("../services/emailParser"); // Import the email service
const { EmailSchema } = require("../models/Email"); // Import the Email model

export const createEmailController = () => {
  const emailParser = createEmailParser();

  // Controller method to fetch new emails with attachments from the email server
  const fetchNewEmails = async (req, res) => {
    try {
      const emails = await emailParser.fetchEmails(); // Fetch emails using the service
      res.json({ success: true, count: emails.length, emails });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  // Controller method to get emails from the database with optional filters and pagination
  const getEmails = async (req, res) => {
    try {
      const { page = 1, limit = 10, hasInvoice } = req.query;
      const query = hasInvoice ? { hasInvoice: hasInvoice === "true" } : {}; // Filter for emails with or without invoices

      // Query the database for emails with optional pagination and filtering
      const emails = await Email.find(query)
        .sort({ date: -1 }) // Sort by date in descending order
        .limit(limit * 1) // Limit the number of emails returned
        .skip((page - 1) * limit) // Skip the appropriate number of emails based on the page
        .exec();

      // Get the total count of emails for pagination
      const count = await Email.countDocuments(query);

      // Respond with the paginated email list
      res.json({
        emails,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
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
