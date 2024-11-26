const Imap = require("node-imap");
const { simpleParser } = require("mailparser");
const { emailConfig } = require("../config/email.js"); 
const { Email } = require("../models/Email.js");

const createEmailParser = () => {
  const fetchEmails = async () => {
    return new Promise((resolve, reject) => {
      console.log('Detailed IMAP Configuration:', {
        host: emailConfig.host,
        port: emailConfig.port,
        user: emailConfig.user.replace(/./g, '*'), // Mask email
        tlsOptions: emailConfig.tlsOptions
      });

      const imap = new Imap({
        host: emailConfig.host,
        port: emailConfig.port,
        user: emailConfig.user,
        password: emailConfig.password,
        tls: true,
        tlsOptions: { 
          rejectUnauthorized: false 
        }
      });

      // Increase max listeners to prevent warnings
      imap.setMaxListeners(30);

      // Comprehensive error logging
      const logDetailedError = (err) => {
        console.error('Detailed IMAP Connection Error:', {
          message: err.message,
          code: err.code,
          errno: err.errno,
          syscall: err.syscall,
          address: err.address,
          port: err.port
        });
      };

      imap.once('error', (err) => {
        logDetailedError(err);
        reject(err);
      });

      imap.once('end', () => {
        console.log('IMAP connection ended');
      });

      imap.once('ready', () => {
        console.log('IMAP server connection established');

        imap.openBox('INBOX', false, (err, box) => {
          if (err) {
            console.error('Error opening inbox:', err);
            imap.end();
            reject(err);
            return;
          }

          console.log(`Total messages in inbox: ${box.messages.total}`);

          // Fetch all messages to process attachments
          const fetch = imap.seq.fetch('1:*', {
            bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)', 'TEXT'],
            struct: true
          });

          const processedEmails = [];

          fetch.on('message', (msg) => {
            const emailData = {
              subject: '',
              sender: '',
              recipient: '',
              date: new Date(),
              emailText: '',
              hasInvoice: false,
              attachments: []
            };

            msg.on('body', async (stream, info) => {
              try {
                const parsed = await simpleParser(stream);

                emailData.subject = parsed.subject || 'No Subject';
                emailData.sender = parsed.from?.text || 'Unknown Sender';
                emailData.recipient = parsed.to?.text || 'Unknown Recipient';
                emailData.date = parsed.date || new Date();
                emailData.emailText = parsed.text || '';

                // Check for attachments
                if (parsed.attachments && parsed.attachments.length > 0) {
                  emailData.attachments = parsed.attachments.map((attachment) => ({
                    filename: attachment.filename || 'unnamed',
                    path: attachment.contentDisposition || '',
                    size: attachment.size || 0,
                    mimeType: attachment.contentType || 'unknown'
                  }));

                  const email = new Email(emailData);
                  await email.save();
                  processedEmails.push(emailData);
                }
              } catch (parseError) {
                console.error('Email parsing error:', parseError);
              }
            });

            msg.once('attributes', (attrs) => {
              // Additional logging for debugging
              console.log('Message attributes:', attrs);
            });
          });

          fetch.once('error', (fetchErr) => {
            console.error('Fetch error:', fetchErr);
            imap.end();
            reject(fetchErr);
          });

          fetch.once('end', () => {
            console.log('Finished fetching emails');
            console.log(`Processed emails with attachments: ${processedEmails.length}`);
            imap.end();
            resolve(processedEmails);
          });
        });
      });

      // Detailed connection error handling
      try {
        imap.connect();
      } catch (connectError) {
        console.error('Initial connection error:', connectError);
        logDetailedError(connectError);
        reject(connectError);
      }
    });
  };

  return { fetchEmails };
};

module.exports = createEmailParser;