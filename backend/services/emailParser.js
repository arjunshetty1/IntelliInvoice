const Imap = require("node-imap");
const { simpleParser } = require("mailparser");
const { emailConfig } = require("../config/email.js"); 
const { Email } = require("../models/Email.js");
const fs = require("fs").promises;
const path = require("path");

const createEmailParser = () => {
  const imap = new Imap(emailConfig);

  // Function to fetch emails with attachments
  const fetchEmails = async () => {
    return new Promise((resolve, reject) => {
      // Connect to the IMAP server
      imap.once("ready", () => {
        // Open the inbox
        imap.openBox("INBOX", false, (err, box) => {
          if (err) {
            reject(err);
            return;
          }

          // Search for emails with attachments
          imap.search(["ALL", ["ATTACHMENT", true]], (err, results) => {
            if (err) {
              reject(err);
              return;
            }

            if (results.length === 0) {
              resolve("No emails with attachments found");
              return;
            }

            const fetch = imap.fetch(results, {
              bodies: ["HEADER.FIELDS (FROM TO SUBJECT DATE)", "TEXT"],
              struct: true,
            });

            fetch.on("message", (msg, seqno) => {
              msg.on("body", async (stream) => {
                // Parse the email content using mailparser
                const parsed = await simpleParser(stream);

                // Check if the email has attachments
                if (parsed.attachments && parsed.attachments.length > 0) {
                  console.log(
                    `Email with subject: ${parsed.subject} has attachments`
                  );

                  // Save the email with attachments to the database
                  const emailData = {
                    subject: parsed.subject,
                    sender: parsed.from.text,
                    recipient: parsed.to.text,
                    date: parsed.date,
                    emailText: parsed.text,
                    hasInvoice: false, // Can be determined based on attachment or content
                    attachments: parsed.attachments.map((attachment) => ({
                      filename: attachment.filename,
                      path: attachment.contentDisposition,
                      isInvoice: false, // You can add logic to detect invoices
                      invoiceDetails: {
                        invoiceNumber: '', // Parse invoice number if needed
                        invoiceDate: '', // Parse invoice date if needed
                        amountDue: 0, // Parse amount if needed
                      }
                    })),
                  };
                  
                  // Save email with attachments to the database
                  const email = new Email(emailData);
                  await email.save();
                }
              });
            });

            fetch.once("end", () => {
              resolve("Finished fetching emails with attachments");
            });
          });
        });
      });

      // Handle errors during connection
      imap.once("error", (err) => {
        reject(err);
      });

      // Open the IMAP connection
      imap.connect();
    });
  };

  return {
    fetchEmails,
  };
};

module.exports = createEmailParser;
