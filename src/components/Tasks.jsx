import React from "react";

export default function Tasks({
  title, 
  date, 
  task,
  onTitleChange,
  onDateChange,
  onTaskChange,
  handleSubmit}) {
    return (
        <div className="flex items-center justify-center h-[400px]">
        <div className="flex flex-col items-center justify-center bg-[#664d49]/80 p-6 rounded-lg shadow-lg w-full max-w-md">
          {/* Title and time */}
          <input
            name="title"
            type="text"
            placeholder="Title"
            value={title}
            onChange={onTitleChange}
            className="w-full p-2 mb-4 border rounded-md text-red-400"
          />
          <input
            name="date"
            type="date"
            value={date}
            onChange={onDateChange}
            className="w-full p-2 mb-4 border rounded-md text-red-400"
          />
          {/* Input and Button */}
          <textarea
            name="task"
            placeholder="Task"
            value={task}
            onChange={onTaskChange}
            className="w-full p-2 mb-4 border rounded-md text-red-400"
          ></textarea>
          <button onClick={handleSubmit} aria-label="Add task" className='bg-red-400 hover:bg-[#f6f285] cursor-pointer' >➕</button>
        </div>
    </div>
    )
}