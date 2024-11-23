import React, { useState } from 'react';
import { X, Download, FileText, AlertCircle } from 'lucide-react';

function EmailModal({ email, onClose }) {
  const [activeAttachment, setActiveAttachment] = useState(null);

  // Simulated OCR results (in a real app, this would come from the backend)
  const ocrResults = {
    'invoice_1001.pdf': 'Invoice #1001\nTotal Amount: $500\nDue Date: 2024-03-15',
    'invoice_1002.pdf': 'Invoice #1002\nTotal Amount: $750\nDue Date: 2024-03-20',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 bg-gray-100 flex justify-between items-center border-b">
          <h2 className="text-2xl font-bold text-gray-800">{email.subject}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex-grow overflow-auto p-6">
          <div className="mb-6">
            <p className="mb-2"><strong>From:</strong> {email.sender}</p>
            <p className="mb-2"><strong>Date:</strong> {email.receivedAt.toLocaleString()}</p>
            <p className="mb-2"><strong>To:</strong> you@example.com</p>
          </div>
          
          {email.isInvoice && (
            <div className="mb-6 p-4 bg-green-100 rounded-lg flex items-center">
              <AlertCircle className="w-6 h-6 text-green-600 mr-2" />
              <span className="text-green-800 font-semibold">
                This email has been detected as an invoice (Confidence: 95%)
              </span>
            </div>
          )}
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Email Content:</h3>
            <p className="whitespace-pre-wrap">{email.fullContent || email.preview}</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Attachments:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {email.attachments.map(attachment => (
                <div key={attachment._id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{attachment.filename}</span>
                    <button className="text-blue-600 hover:text-blue-800">
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                  <button
                    onClick={() => setActiveAttachment(attachment.filename)}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <FileText className="w-4 h-4 mr-1" />
                    View OCR Result
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          {activeAttachment && (
            <div className="mt-6 p-4 bg-gray-100 rounded-lg">
              <h4 className="font-semibold mb-2">OCR Result for {activeAttachment}:</h4>
              <pre className="whitespace-pre-wrap bg-white p-2 rounded border">
                {ocrResults[activeAttachment] || 'No OCR data available'}
              </pre>
            </div>
          )}
        </div>
        
        <div className="p-4 bg-gray-100 border-t flex justify-end">
          <button 
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default EmailModal;