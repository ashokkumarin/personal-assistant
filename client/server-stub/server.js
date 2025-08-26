const express = require('express')
const app = express()
app.use(express.json())


app.post('/parse', (req, res) => {
const { text } = req.body
// naive parser: this is just a demo. Replace with your AWS parsing logic.
if (!text) return res.status(400).json({ error: 'no text' })


// pick first line for demo
const firstLine = (text.split('\n').find(Boolean) || '').trim()
// super-simple heuristics
let title = firstLine
let dueDate = null
let time = null
if (/\b(\d{1,2}(st|nd|rd|th)?\s+[A-Za-z]+)\b/.test(text)) {
// pretend we found 30th Aug -> send as example
dueDate = '2025-08-30'
}
if (/evening|morning|afternoon|noon/.test(text)) {
time = '18:00'
}


res.json({ title, description: text, dueDate, time, reminder: 'notification' })
})


app.post('/confirm', (req, res) => {
// persist task in DB in real app
const task = req.body
console.log('Confirmed task:', task)
res.json({ ok: true, id: 'task_' + Date.now() })
})


app.listen(4000, () => console.log('Server stub listening on http://localhost:4000'))