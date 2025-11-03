const express = require('express')
const cors = require('cors')

const app = express()
const port = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// In-memory tasks store for development
let tasks = [
  { id: 1, description: 'Sample task' }
]
let nextId = 2

app.get('/', (req, res) => {
  // Return the tasks list at the root so the frontend can call the base URL
  res.json(tasks)
})

app.get('/tasks', (req, res) => {
  res.json(tasks)
})

app.post('/create', (req, res) => {
  const incoming = req.body?.task
  if (!incoming || !incoming.description) {
    return res.status(400).json({ error: 'Missing task.description' })
  }
  const newTask = { id: nextId++, description: String(incoming.description) }
  tasks.push(newTask)
  res.status(201).json(newTask)
})

app.delete('/delete/:id', (req, res) => {
  const id = Number(req.params.id)
  const before = tasks.length
  tasks = tasks.filter(t => t.id !== id)
  if (tasks.length === before) return res.status(404).json({ error: 'Not found' })
  res.json({ success: true })
})

app.listen(port, () => console.log(`Server listening on http://localhost:${port}`))

