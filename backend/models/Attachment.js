const mongoose = require("mongoose");

const AttachmentSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  ocrText: {
    type: String,
  },
  isInvoice: {
    type: Boolean,
    default: false,
  },
  invoiceDetails: {
    invoiceNumber: String,
    invoiceDate: Date,
    amountDue: Number, 
  },
  size: {
    type: Number,
    required: true,
  },
  mimeType: {
    type: String,
    required: true,
  },
});

const Attachment = mongoose.model("Attachment", AttachmentSchema);

module.exports = {
  Attachment,
  AttachmentSchema,
};