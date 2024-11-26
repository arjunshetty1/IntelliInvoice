const mongoose = require("mongoose");
const { AttachmentSchema } = require("./Attachment");

const EmailSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
  },

  sender: {
    type: String,
    required: true,
    lowercase: true,
  },

  recipient: {
    type: String,
    required: true,
    lowercase: true,
  },
  date: {
    type: Date,
    required: true,
  },
  emailText: {
    type: String,
  },
  hasInvoice: {
    type: Boolean,
    // required: true,
  },

  attcahments: [AttachmentSchema],
});

const Email = mongoose.model("Email", EmailSchema);

module.exports = { Email, EmailSchema };
