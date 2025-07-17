// src/Greeting.jsx
import { useEffect, useState } from 'react';

function Greeting() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setIsModalOpen(true); // Show modal on page load
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
    
    {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[url(background3.jpg)] bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
              Welcome to TaskBrisker!
            </h2>
            <p>
                The goal of this app is to help you tackle your tasks easily, create your tasks and automatically they get 
                organize. When creating a task, the title and task field are required.
                Once a task is created only the calendar can be edited, this is in order to help you create each task with absolute awareness,
                but also giving you the flexibility to change the date and so that you can brisk your task another day.
                We chose the word "brisk" because we want you to feel energized and motivated to complete your tasks instead
                of making them feel like a boring to-do list. We look forward to helping you, so please brisk your task away!
            </p>
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition
              flex justify-center mt-5 ml-[35%] content-end"
            >
              Close
            </button>
          </div>
        </div>
      )}
   
    </>
      
  );
}

export default Greeting;