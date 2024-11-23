import React from 'react';
import { FileText, Download } from 'lucide-react';

function EmailList({ emails, setSelectedEmail }) {
  return (
    <div className="space-y-4">
      {emails.map(email => (
        <div 
          key={email._id} 
          className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 p-5 mb-4"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold">
                  {email.sender.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{email.sender}</h3>
                <p className="text-sm text-gray-500">
                  {email.receivedAt.toLocaleDateString()}
                </p>
              </div>
            </div>
            {email.isInvoice && (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                Invoice
              </span>
            )}
          </div>
          <div className="mb-3">
            <h4 className="font-bold text-lg text-gray-900 mb-2">{email.subject}</h4>
            <p className="text-gray-600">{email.preview}</p>
          </div>
          <div className="flex justify-between items-center border-t pt-3 mt-3">
            <button 
              className="flex items-center text-blue-600 hover:text-blue-800 transition"
              onClick={() => setSelectedEmail(email)}
            >
              <FileText className="mr-2 w-5 h-5" />
              View Details
            </button>
            <button 
              className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-md hover:bg-blue-100 transition flex items-center"
            >
              <Download className="mr-2 w-4 h-4" />
              Download PDF
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default EmailList;