// frontend/src/pages/ActiveUser.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Logout, Tasks, NewTasks, UserFooter, SortButton} from '../components';

export default function ActiveUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [task, setTask] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('date'); // State for sorting

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }
        const response = await fetch(`http://localhost:3000/api/users/${id}/tasks`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch tasks');
        }
        const data = await response.json();
        setTasks(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        if (err.message.includes('token')) {
          navigate('/login');
        }
      }
    };
    fetchTasks();
  }, [id, navigate]);

  async function taskHandler() {
    if (title.trim().length > 0 && task.trim().length > 0) {
      const finalDate =
        date.trim() === ''
          ? 'Not time sensitive'
          : new Date(date.replace(/\//g, '-')).toLocaleDateString('en-US', {
              month: '2-digit',
              day: '2-digit',
              year: 'numeric',
            });
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }
        const response = await fetch(`http://localhost:3000/api/users/${id}/tasks`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ title, task_text: task, due_date: finalDate }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create task');
        }
        const newTask = await response.json();
        setTasks([newTask, ...tasks]);
        setTitle('');
        setDate('');
        setTask('');
      } catch (err) {
        alert('Error creating task: ' + err.message);
        if (err.message.includes('token')) {
          navigate('/login');
        }
      }
    } else {
      alert('Title and Task field are required');
    }
  }

  async function handleDateChange(taskId, newDate) {
    try {
      const formattedDate =
        !newDate || newDate === 'Not time sensitive'
          ? 'Not time sensitive'
          : new Date(newDate.replace(/\//g, '-')).toLocaleDateString('en-US', {
              month: '2-digit',
              day: '2-digit',
              year: 'numeric',
            });
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      const response = await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ due_date: formattedDate }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update task');
      }
      const updatedTask = await response.json();
      setTasks(tasks.map((t) => (t.task_id === taskId ? updatedTask : t)));
    } catch (err) {
      alert('Error updating task: ' + err.message);
      if (err.message.includes('token')) {
        navigate('/login');
      }
    }
  }

  async function handleDelete(taskId) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      const response = await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete task');
      }
      setTasks(tasks.filter((t) => t.task_id !== taskId));
    } catch (err) {
      alert('Error deleting task: ' + err.message);
      if (err.message.includes('token')) {
        navigate('/login');
      }
    }
  }

  // Sort tasks based on sortBy state
  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    const dateA = a.due_date === 'Not time sensitive' ? '9999-12-31' : a.due_date;
    const dateB = b.due_date === 'Not time sensitive' ? '9999-12-31' : b.due_date;
    return new Date(dateA) - new Date(dateB);
  });

  if (loading) return <div className="text-center">Loading tasks... <span className="animate-spin">⏳</span></div>;
  if (error) return <div className="text-center text-red-500">Error: {error}</div>;

  return (
    <div className="flex flex-col min-h-screen">
      <Logout />
      <main className="flex-grow">
      <h1 className='text-[#e94d35] font-bold flex justify-center text-7xl italic mt-20'>
              Brisk your tasks away!
      </h1>
      <Tasks
        title={title}
        date={date}
        task={task}
        onTitleChange={(e) => setTitle(e.target.value)}
        onDateChange={(e) => setDate(e.target.value)}
        onTaskChange={(e) => setTask(e.target.value)}
        handleSubmit={taskHandler}
      />
      <SortButton sortBy={sortBy} setSortBy={setSortBy} />
      {sortedTasks.map((t) => (
        <NewTasks
          key={t.task_id}
          title={t.title}
          date={t.due_date}
          task={t.task_text}
          onDateChange={handleDateChange}
          handleDelete={() => handleDelete(t.task_id)}
          id={t.task_id}
        />
      ))}
      
    </main>
    <UserFooter />
    </div>
    
  );
}