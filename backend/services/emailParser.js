const Imap = require("node-imap");
const { simpleParser } = require("mailparser");
const { emailConfig } = require("../config/email.js"); 
const { Email } = require("../models/Email.js");
const fs = require("fs").promises;
const path = require("path");

const createEmailParser = () => {
  const imap = new Imap(emailConfig);

  const fetchEmails = async () => {
    return new Promise((resolve, reject) => {
      console.log('Attempting to connect to IMAP server...'); 
  
      // Connect to the IMAP server
      imap.once("ready", () => {
        console.log('IMAP server connection established'); 
  
        // Open the inbox
        imap.openBox("INBOX", false, (err, box) => {
          if (err) {
            console.error('Error opening inbox:', err); 
            reject(err);
            return;
          }
  
          console.log(`Total messages in inbox: ${box.messages.total}`); 
  
       
          imap.search(["ALL", ["ATTACHMENT", true]], (err, results) => {
            if (err) {
              console.error('Error searching for emails:', err); 
              reject(err);
              return;
            }
  
            console.log(`Emails with attachments found: ${results.length}`); 
  
            if (results.length === 0) {
              console.log('No emails with attachments found');
              resolve("No emails with attachments found");
              return;
            }

            const fetch = imap.fetch(results, {
              bodies: ["HEADER.FIELDS (FROM TO SUBJECT DATE)", "TEXT"],
              struct: true,
            });

            fetch.on("message", (msg, seqno) => {
              msg.on("body", async (stream) => {
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
                    hasInvoice: false, 
                    attachments: parsed.attachments.map((attachment) => ({
                      filename: attachment.filename,
                      path: attachment.contentDisposition,
                      isInvoice: false, 
                      invoiceDetails: {
                        invoiceNumber: '', 
                        invoiceDate: '', 
                        amountDue: 0, 
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
