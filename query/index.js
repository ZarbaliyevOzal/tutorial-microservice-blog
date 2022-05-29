const express = require('express')
const app = express()
const axios = require('axios')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const posts = []
const comments = []

const handleEvent = (type, data) => {
  if (type === 'PostCreated') {
    posts.push(data)
  } 
  
  if (type === 'CommentCreated') {
    comments.push(data)
  }

  if (type === 'CommentUpdated') {
    let comment = comments.find((item) => item.id === data.id)
    comment = data
  }
}

app.get('/posts', (req, res) => {
  res.send(posts)
})

app.post('/events', (req, res) => {
  const { type, data } = req.body

  handleEvent(type, data)

  res.send({})
})

app.listen(4002, async () => {
  console.log('[Query service] listening on port 4002');

  let events = []
    
  await axios.get('http://event-bus-srv:4005/events')
    .then((res) => events = res.data)
    .catch((err) => console.log(err.message))

  for (const event of events) {
    handleEvent(event.type, event.data)
  }
})