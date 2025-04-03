import express from 'express'
import http from 'http'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { Server } from 'socket.io'

import authRoutes from './authRoutes'
import errorHandler from './errorHandler'
import { Room } from './types'

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

const DEFAULT_ROOM = 'General'
const chat: Room[] = [{ name: DEFAULT_ROOM, usersOnline: 0, messages: [] }]

const getRoom = (name: string): Room | null => {
  const room = chat.find((room) => room.name === name)
  if (!room) {
    return null
  }

  return room
}

const createRoom = (name: string) => {
  const room: Room = {
    name,
    usersOnline: 0,
    messages: [],
  }
  chat.push(room)
}

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
})

io.on('connection', (socket) => {
  console.log('connected: ', socket.id)
  socket.join(DEFAULT_ROOM)

  socket.emit('room:get', { rooms: chat })

  socket.on('room:change', (data: { room: string }) => {
    socket.rooms.forEach((room) => {
      socket.leave(room)
    })

    socket.join(data.room)

    const room = getRoom(data.room)
    io.emit('chat:get', { messages: room ? room.messages : [] })
  })

  socket.on('room:create', (data: { room: string }) => {
    let room = getRoom(data.room)
    if (!room) {
      createRoom(data.room)
    }
  })

  socket.on('chat:send', (data: { room: string; message: string; username: string }) => {
    const room = getRoom(data.room)

    if (!room) {
      return
    }

    room.messages.push({
      id: room.messages.length + 1,
      message: data.message,
      username: data.username,
      date: new Date().toString(),
    })

    io.to(room.name).emit('chat:get', { messages: room.messages })
  })

  socket.on('disconnect', () => {
    console.log('disconnected: ', socket.id)
  })
})

app.use(authRoutes)
app.use(errorHandler)

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
