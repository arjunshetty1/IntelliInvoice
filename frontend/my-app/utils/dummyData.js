export const generateDummyEmails = () => {
    const senders = ['Acme Corp', 'Global Supplies', 'Tech Innovations', 'Office Depot', 'Business Solutions'];
    const domains = ['@gmail.com', '@company.com', '@outlook.com'];
    
    return Array.from({ length: 50 }, (_, index) => ({
      _id: `email_${index}`,
      sender: `${senders[Math.floor(Math.random() * senders.length)]}${domains[Math.floor(Math.random() * domains.length)]}`,
      subject: `Invoice #${1000 + index} - ${['January', 'February', 'March'][Math.floor(Math.random() * 3)]} Statement`,
      preview: 'Detailed invoice for recent services and products...',
      receivedAt: new Date(2024, Math.floor(Math.random() * 6), Math.floor(Math.random() * 28)),
      isInvoice: Math.random() > 0.3,
      attachments: [
        {
          _id: `attachment_${index}`,
          filename: `invoice_${1000 + index}.pdf`
        }
      ]
    }));
  };