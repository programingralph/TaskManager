import { useState } from 'react'
import './App.css'
import { Header, Footer, Tasks, NewTasks, Greeting } from './components'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {Login, Register, ActiveUser} from "./pages/index";




function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [task, setTask] = useState("");
  // const [id, setId] = useState(0)

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

  function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}


  return (
    <Routes>
      <Route
        path='/'
        element={
          <>
          <div className="flex flex-col min-h-screen">
             <Header />
             {/* Your header or main content */}
            <main className="flex-grow">
               <h1 className='text-[#e94d35] font-bold flex justify-center text-7xl italic mt-20'>
              Brisk your tasks below
            </h1>
            <Greeting />
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
              {/* Your app’s content */}
           </main>

           {/* Your footer component */}
           <Footer />
          </div>
          </>
        }
      />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path="/user/:id" element={<ProtectedRoute><ActiveUser /></ProtectedRoute>} />
      <Route path="*" element={<div className="text-center text-red-500 mt-20">404: Page Not Found</div>} />
      
    </Routes>
  )

  }


export default App
