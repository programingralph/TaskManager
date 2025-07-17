import React from 'react';

export default function SortButton({ sortBy, setSortBy }) {
  return (
    <div className="flex justify-center mb-4">
      <button
        onClick={() => setSortBy(sortBy === 'date' ? 'title' : 'date')}
        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors duration-200"
      >
        Sort by {sortBy === 'date' ? 'Title' : 'Date'}
      </button>
    </div>
  );
}