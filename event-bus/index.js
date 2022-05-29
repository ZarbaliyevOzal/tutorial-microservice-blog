const axios = require('axios')
const express = require('express')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const events = []

app.get('/events', (req, res) => {
  res.send(events)
})

app.post('/events', (req, res) => {
  const event = req.body

  events.push(event)

  axios.post('http://posts-clusterip-srv:4000/events', event)
    .catch((err) => console.log(err.message))
  axios.post('http://commments-clusterip-srv:4001/events', event)
    .catch((err) => console.log(err.message))
  axios.post('http://query-clusterip-srv:4002/events', event)
    .catch((err) => console.log(err.message))
  axios.post('http://moderation-clusterip-srv:4003/events', event)
    .catch((err) => console.log(err.message))

  res.send({ status: 'OK' })
})

app.listen(4005, () => {
  console.log('[Event bus] listening on port 4005');
})