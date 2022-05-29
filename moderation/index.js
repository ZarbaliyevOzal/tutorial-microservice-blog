const express = require('express')
const app = express()
const axios = require('axios')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.post('/events', async (req, res) => {
  const { type, data } = req.body

  if (type === 'CommentCreated') {
    const status = data.content.includes('orange') ? 'rejected' : 'approved'
    data.status = status
    console.log(data);
    await axios.post('http://event-bus-srv:4005/events', {
      type: 'CommentModerated',
      data
    })
      .catch((err) => console.log(err.message))
  }

  res.send({})
})

app.listen(4003, () => {
  console.log('[Moderation] listening on port 4003');
})