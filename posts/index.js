const express = require('express')
const app = express()
const { randomBytes } = require('crypto')
const axios = require('axios')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const posts = []

app.post('/posts/create', async (req, res) => {
  const id = randomBytes(4).toString('hex')
  const { title } = req.body
  posts.push({ id, title })
  await axios.post('http://event-bus-srv:4005/events', { type: 'PostCreated', data: posts.at(-1) })
    .catch((err) => console.log(err.message))
  return res.status(201).send(posts.at(-1))
})

app.post('/events', (req, res) => {
  console.log('Received event', req.body.type)
  res.send({})
})
 
app.listen(4000, () => {
  console.log('[Posts] listening on port 4000')
})