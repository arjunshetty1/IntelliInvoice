import React from 'react';
import { Bell, Users } from 'lucide-react';

function Header() {
  return (
    <div className="bg-gray-100 p-6 flex justify-between items-center border-b">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Invoice Detector</h1>
        <p className="text-gray-500">Manage and track your email invoices</p>
      </div>
      <div className="flex items-center space-x-4">
        <button className="text-gray-600 hover:text-blue-600 transition">
          <Bell className="w-6 h-6" />
        </button>
        <button className="text-gray-600 hover:text-blue-600 transition">
          <Users className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

export default Header;