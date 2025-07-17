import React, { useState } from 'react';

export default function NewTasks({ title, date, task, handleDelete, id, onDateChange }) {
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [newDate, setNewDate] = useState(''); // Local state for date input

  return (
    <div className="inline-flex mt-2 border-dashed">
      <div className="flex flex-col ml-5 items-center justify-center bg-[#664d49]/80 p-6 rounded-lg shadow-lg w-full max-w-md">
        <input
          name="title"
          type="text"
          placeholder="Title"
          value={title}
          className="w-full p-2 mb-4 border rounded-md text-red-400"
          readOnly
        />
        {isEditingDate ? (
          <input
            name="date"
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)} // Update local state
            onBlur={() => {
              const inputDate = newDate; // YYYY-MM-DD or empty
              onDateChange(id, inputDate || 'Not time sensitive'); // Pass raw value
              setIsEditingDate(false);
              setNewDate('');
            }}
            className="w-full p-2 mb-4 border rounded-md text-red-400"
          />
        ) : (
          <div
            onClick={() => setIsEditingDate(true)}
            className="w-full p-2 mb-4 border rounded-md text-red-400 cursor-pointer"
          >
            {date}
          </div>
        )}
        <textarea
          name="task"
          placeholder="Task"
          value={task}
          readOnly
          className="w-full p-2 mb-4 border rounded-md text-red-400"
        ></textarea>
        <button
          onClick={() => handleDelete(id)}
          aria-label="Delete task"
          className="bg-red-700 hover:bg-[#f0e6db] cursor-pointer rounded-md"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}