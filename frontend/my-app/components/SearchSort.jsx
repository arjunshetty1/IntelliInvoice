import React from 'react';
import { Search } from 'lucide-react';

function SearchSort({ searchTerm, setSearchTerm, sortBy, setSortBy, activeTab, setActiveTab }) {
  return (
    <>
      <div className="flex mb-6 space-x-4">
        <div className="relative flex-grow">
          <input 
            type="text"
            placeholder="Search emails by subject or sender"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 transition"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
        
        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 transition"
        >
          <option value="date">Sort by Date</option>
          <option value="sender">Sort by Sender</option>
          <option value="invoice">Sort by Invoice Status</option>
        </select>
      </div>

      <div className="flex mb-6 space-x-2">
        {['all', 'invoices'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              activeTab === tab 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab === 'all' ? 'All Emails' : 'Invoices Only'}
          </button>
        ))}
      </div>
    </>
  );
}

export default SearchSort;