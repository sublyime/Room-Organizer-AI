
import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

export const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center gap-3">
        <SparklesIcon className="w-8 h-8 text-indigo-500" />
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Room Organizer AI</h1>
          <p className="text-sm text-gray-500">Declutter and design with the power of AI</p>
        </div>
      </div>
    </header>
  );
};
