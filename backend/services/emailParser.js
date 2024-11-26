const Imap = require("node-imap");
const { simpleParser } = require("mailparser");
const { emailConfig } = require("../config/email.js"); 
const { Email } = require("../models/Email.js");
const fs = require('fs').promises;
const path = require('path');

const createEmailParser = () => {
  const fetchEmails = async () => {
    return new Promise((resolve, reject) => {
      console.log('📧 Detailed IMAP Configuration:', {
        host: emailConfig.host,
        port: emailConfig.port,
        user: emailConfig.user.replace(/./g, '*'), 
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
        console.error('🚨 Detailed IMAP Connection Error:', {
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
        console.log('📭 IMAP connection ended');
      });

      imap.once('ready', () => {
        console.log('🔗 IMAP server connection established');

        imap.openBox('INBOX', false, (err, box) => {
          if (err) {
            console.error('❌ Error opening inbox:', err);
            imap.end();
            reject(err);
            return;
          }

          console.log(`📬 Total messages in inbox: ${box.messages.total}`);

          // Fetch all messages (last 30 days or last 50 messages)
          const fetch = imap.seq.fetch('1:50', {
            bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)', '', 'TEXT'],
            struct: true,
            markSeen: false  // Don't mark emails as read
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
                console.log('🔍 Processing email body:', info.which);
                
                const parsed = await simpleParser(stream);

                // Enhanced debugging logs
                console.log('📧 Email Parsing Details:', {
                  subject: parsed.subject,
                  from: parsed.from?.text,
                  to: parsed.to?.text,
                  date: parsed.date,
                  hasAttachments: parsed.attachments ? parsed.attachments.length : 'No attachments'
                });

                // Process attachments with more robust checks
                if (parsed.attachments && parsed.attachments.length > 0) {
                  console.log(`📎 Found ${parsed.attachments.length} attachments`);

                  // Create attachments directory if it doesn't exist
                  const attachmentDir = path.join(__dirname, '../uploads/attachments');
                  await fs.mkdir(attachmentDir, { recursive: true });

                  // Process and save each attachment
                  const attachmentPromises = parsed.attachments.map(async (attachment) => {
                    try {
                      const filename = attachment.filename || `unnamed_${Date.now()}`;
                      const filePath = path.join(attachmentDir, filename);

                      // Write attachment to file system
                      await fs.writeFile(filePath, attachment.content);

                      console.log(`💾 Saved attachment: ${filename}`);

                      return {
                        filename: filename,
                        path: filePath,
                        size: attachment.size || 0,
                        mimeType: attachment.contentType || 'unknown'
                      };
                    } catch (saveError) {
                      console.error('❌ Attachment save error:', saveError);
                      return null;
                    }
                  });

                  // Filter out any failed attachment saves
                  emailData.attachments = (await Promise.all(attachmentPromises)).filter(Boolean);

                  // Set invoice flag if attachment is PDF (example condition)
                  emailData.hasInvoice = emailData.attachments.some(
                    attachment => attachment.mimeType.includes('pdf')
                  );
                }

                // Populate other email data
                emailData.subject = parsed.subject || 'No Subject';
                emailData.sender = parsed.from?.text || 'Unknown Sender';
                emailData.recipient = parsed.to?.text || 'Unknown Recipient';
                emailData.date = parsed.date || new Date();
                emailData.emailText = parsed.text || parsed.textAsHtml || '';

                // Save to database only if it has something interesting
                if (emailData.attachments.length > 0 || emailData.emailText) {
                  try {
                    const email = new Email(emailData);
                    await email.save();
                    processedEmails.push(emailData);
                    console.log('💽 Email saved to database');
                  } catch (saveError) {
                    console.error('❌ Database save error:', saveError);
                  }
                }
              } catch (parseError) {
                console.error('❌ Email parsing error:', {
                  message: parseError.message,
                  stack: parseError.stack
                });
              }
            });

            msg.once('attributes', (attrs) => {
              // Optional: Additional logging for debugging
              console.log('📊 Message attributes:', {
                seqno: attrs.seqno,
                flags: attrs.flags
              });
            });
          });

          fetch.once('error', (fetchErr) => {
            console.error('❌ Fetch error:', fetchErr);
            imap.end();
            reject(fetchErr);
          });

          fetch.once('end', () => {
            console.log(`✅ Finished fetching emails`);
            console.log(`📊 Processed emails with content: ${processedEmails.length}`);
            imap.end();
            resolve(processedEmails);
          });
        });
      });

      // Detailed connection error handling
      try {
        imap.connect();
      } catch (connectError) {
        console.error('❌ Initial connection error:', connectError);
        logDetailedError(connectError);
        reject(connectError);
      }
    });
  };

  return { fetchEmails };
};

module.exports = createEmailParser;