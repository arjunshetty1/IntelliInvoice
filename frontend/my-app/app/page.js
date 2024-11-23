"use client"

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import SearchSort from '@/components/SearchSort';
import EmailList from '@/components/EmailList'; 
import Pagination from '@/components/Pagination';
import EmailModal from '@/components/EmailModal';
import { generateDummyEmails } from '@/utils/dummyData';



function App() {
  const [emails, setEmails] = useState([]);
  const [filteredEmails, setFilteredEmails] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedEmail, setSelectedEmail] = useState(null);
  const itemsPerPage = 10;

  useEffect(() => {
    setEmails(generateDummyEmails());
  }, []);

  useEffect(() => {
    filterAndSortEmails();
  }, [emails, searchTerm, sortBy, activeTab]);

  const filterAndSortEmails = () => {
    let result = emails.filter(email => 
      (activeTab === 'invoices' ? email.isInvoice : true) &&
      (email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
       email.sender.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    switch(sortBy) {
      case 'date':
        result.sort((a, b) => new Date(b.receivedAt) - new Date(a.receivedAt));
        break;
      case 'sender':
        result.sort((a, b) => a.sender.localeCompare(b.sender));
        break;
      case 'invoice':
        result.sort((a, b) => (b.isInvoice ? 1 : -1));
        break;
      default:
        break;
    }

    setFilteredEmails(result);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <Header />
        <div className="p-6">
          <SearchSort 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            sortBy={sortBy}
            setSortBy={setSortBy}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <EmailList 
            emails={filteredEmails.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)}
            setSelectedEmail={setSelectedEmail}
          />
          <Pagination 
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={Math.ceil(filteredEmails.length / itemsPerPage)}
          />
        </div>
      </div>
      {selectedEmail && (
        <EmailModal email={selectedEmail} onClose={() => setSelectedEmail(null)} />
      )}
    </div>
  );
}

export default App;