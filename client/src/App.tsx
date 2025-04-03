import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

import { SessionProvider } from './context/SessionContext'
import Authenticate from './components/Authenticate'
import { Message } from './types'

const DEFAULT_ROOM = 'General'

function App() {
  const [room, setRoom] = useState(DEFAULT_ROOM)
  const [socket, setSocket] = useState<Socket | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    const socket = io('http://localhost:8000', {
      withCredentials: true,
    })

    socket.on('connect', () => {
      console.log('connected client')
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
    <SessionProvider>
      <div>
        <header>
          <h1>Chat App</h1>
          <Authenticate />
        </header>
        <main>
          <h2>{room}</h2>
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
        </main>
      </div>
    </SessionProvider>
  )
}

export default App
