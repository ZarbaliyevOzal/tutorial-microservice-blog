const { randomBytes } = require('crypto')
const express = require('express')
const app = express()
const axios = require('axios')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const comments = []

app.get('/posts/:id/comments', (req, res) => {
  const c = comments.filter((item) => item.post_id === req.params.id)
  res.send(c)
})

app.post('/posts/:id/comments', async (req, res) => {
  const id = randomBytes(4).toString('hex')
  const comment = { id, post_id: req.params.id, content: req.body.content, status: 'pending' }
  comments.push(comment)

  await axios.post('http://event-bus-srv:4005/events', { type: 'CommentCreated', data: comments.at(-1) })
    .catch((err) => console.log(err.message))

  res.status(201).send(comments.at(-1))
})

app.post('/events', async (req, res) => {
  console.log('Received event', req.body.type)

  if (req.body.type === 'CommentModerated') {
    let comment = comments.find((item) => item.id === req.body.data.id)
    comment = req.body.data
    await axios.post('http://event-bus-srv:4005/events', {
      type: 'CommentUpdated',
      data: comment
    })
      .catch((err) => console.log(err.message))
  }

  res.send({})
})

app.listen(4001, () => {
  console.log('[Comments] listeingn on port 4001');
})