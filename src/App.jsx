import './App.css'
import { useState, useEffect } from 'react'
import axios from 'axios'


const url = "http://localhost:3001"

function App() {
  const [task, setTask] = useState('')
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    axios.get(url)
      .then(response => setTasks(response.data))
      .catch(error => {
        const msg = error?.response?.data?.message ?? error?.message ?? String(error)
        alert(msg)
      })
  }, [])

  const addTask = () => {
    const trimmed = task.trim()
    if (!trimmed) return
    const newTask = { description: trimmed }
    axios.post(url + "/create", { task: newTask })
      .then(response => {
        setTasks(prev => [...prev, response.data])
        setTask('')
      })
      .catch(error => {
        alert(error?.response?.data?.error?.message ?? String(error))
      })
  }

  const deleteTask = (id) => {
    axios.delete(url + "/delete/" + id)
      .then(() => setTasks(prev => prev.filter(item => item.id !== id)))
      .catch(error => {
        alert(error?.response?.data?.error?.message ?? String(error))
      })
  }

  return (
    <div id="container">
      <h3>Todos</h3>
      <form onSubmit={e => { e.preventDefault(); addTask() }}>
        <input
          placeholder='Add new task'
          value={task}
          onChange={e => setTask(e.target.value)}
        />
      </form>
      <ul>
        {tasks.map(item => (
          <Row item={item} key={item.id} deleteTask={deleteTask} />
        ))}
      </ul>
    </div>
  )
}

export default App
