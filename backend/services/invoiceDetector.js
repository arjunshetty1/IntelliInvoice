const createInvoiceDetector = () => {
    const invoiceKeywords = [
      'invoice', 'bill', 'statement', 'due date',
      'invoice number', 'invoice #', 'amount due',
      'payment terms', 'total amount'
    ];
  
    const detectInvoice = async (text, filename = '') => {
      const textLower = text.toLowerCase();
      const filenameLower = filename.toLowerCase();
      
      const isInvoiceFilename = invoiceKeywords.some(keyword => 
        filenameLower.includes(keyword)
      );
  
      const keywordsFound = invoiceKeywords.filter(keyword =>
        textLower.includes(keyword)
      );
  
      const score = keywordsFound.length / invoiceKeywords.length;
      
      return {
        isInvoice: score > 0.3 || isInvoiceFilename,
        confidence: score,
        keywordsFound
      };
    };
  
    const extractInvoiceDetails = (text) => {
      return {
        invoiceNumber: null,
        date: null,
        dueDate: null,
        totalAmount: null,
      };
    };
  
    return {
      detectInvoice,
      extractInvoiceDetails
    };
  };
  
  module.exports = { createInvoiceDetector };
  