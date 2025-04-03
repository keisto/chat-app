import express from 'express'
import http from 'http'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRoutes from './authRoutes'
import errorHandler from './errorHandler'

const PORT = 8000

const app = express()
const server = http.createServer(app)

app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true, // Allow cookies to be sent
  })
)

// TODO: chat rooms with messages and usersOnline

// TODO: Socket.io

app.use(authRoutes)
app.use(errorHandler)

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
