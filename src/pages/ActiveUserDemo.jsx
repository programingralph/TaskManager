import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logout, Tasks, NewTasks, Footer } from '../components';


export default function ActiveUser() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [task, setTask] = useState("");

    function taskHandler() {
    if (title.trim().length > 0 && task.trim().length > 0) {
      const finalDate = date.trim() === "" ? "Not time sensitive" : new Date(date.replace(/\//g, '-')).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
      });
      const id = Date.now().toString() + Math.floor(Math.random() * 1000)
      setTasks([{title, finalDate, task, id},...tasks]);
      setTitle("");
      setDate("");
      setTask("");
    } else {
      alert("Title and Task field are required");
    }
  }

  function handleDateChange(id, newDate) {
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, finalDate: newDate } : t
      )
    );
  }

  function handleDelete(id) {
    setTasks(tasks.filter(t => t.id !== id));
  }


    return (
        <>
        <Logout />
        <Tasks
              title={title}
              date={date}
              task={task}
              onTitleChange={(e) => setTitle(e.target.value)}
              onDateChange={(e) => setDate(e.target.value)}
              onTaskChange={(e) => setTask(e.target.value)}
              handleSubmit={taskHandler}
            />
            {tasks.map((t) => (
              <NewTasks
                key={t.id}
                title={t.title}
                date={t.finalDate}
                task={t.task}
                onDateChange={handleDateChange} // Pass handler to update date
                handleDelete={() => handleDelete(t.id)}
                id={t.id} // Added id prop
              />
            ))}
            <Footer />

        </>
    )

}