import { useEffect, useState } from 'react'
import { Message, Room } from '../types'
import { io, Socket } from 'socket.io-client'

const DEFAULT_ROOM = 'General'

export default function Chat() {
  const [room, setRoom] = useState(DEFAULT_ROOM)
  const [newRoom, setNewRoom] = useState('')
  const [socket, setSocket] = useState<Socket | null>(null)
  const [rooms, setRooms] = useState<Room[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    const socket = io('http://localhost:8000', {
      withCredentials: true,
    })

    socket.on('connect', () => {
      console.log('connected client')
    })

    socket.on('room:get', (data: { rooms: Room[] }) => {
      setRooms(data.rooms)
    })

    socket.on('chat:get', (data: { messages: Message[] }) => {
      setMessages(data.messages)
    })

    socket.on('disconnect', () => {
      console.log('disconnected client')
    })

    setSocket(socket)
    return () => {
      socket.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!socket) {
      return
    }

    socket.emit('room:change', {
      room,
    })

    setMessages([])
  }, [socket, room])

  const handleCreateRoom = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!socket) {
      return
    }

    socket.emit('room:create', {
      room: newRoom,
    })
    setRoom(newRoom)
    setNewRoom('')
  }

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!socket) {
      return
    }

    socket.emit('chat:send', {
      message,
      username: 'tony', // hard coded because we need to be in a nested component to access session
      room,
    })
    setMessage('')
  }

  return (
    <div>
      <h2>{room}</h2>
      <form onSubmit={handleCreateRoom}>
        <fieldset>
          <label htmlFor="new-room">New Room</label>
          <input id="new-room" value={newRoom} onChange={(e) => setNewRoom(e.target.value)}></input>
        </fieldset>
        <button type="submit">Send</button>
      </form>
      <ul>
        {messages.map((chatMessage) => {
          return <li key={chatMessage.id}>{chatMessage.message}</li>
        })}
      </ul>
      <form onSubmit={handleSendMessage}>
        <fieldset>
          <label htmlFor="message">Message</label>
          <textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
        </fieldset>
        <button type="submit">Send</button>
      </form>
    </div>
  )
}
