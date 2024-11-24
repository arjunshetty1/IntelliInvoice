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
    required: false,
  },
  isInvoice: {
    type: Boolean,
    default: false,
  },

  invoiceDetails: {
    invoiceNumber: String,
    invoiceDate: Date,
    AmoutDue: Number,
  },
});

const Attachment = mongoose.model("Attachment", AttachmentSchema);

module.exports = {
  Attachment,
  AttachmentSchema,
};
