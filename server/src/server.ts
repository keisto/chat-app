import express from 'express'
import http from 'http'

const PORT = 8000

const app = express()
const server = http.createServer(app)

app.use(express.json())

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
