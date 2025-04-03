import { useEffect, useState } from 'react'
import { Message, Room } from '../types'
import { io, Socket } from 'socket.io-client'
import { useSession } from '../context/SessionContext'
import ChatList from './ChatList'

const DEFAULT_ROOM = 'General'

export default function Chat() {
  const { user, isAuthenticated } = useSession()
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
      username: user?.username,
      room,
    })
    setMessage('')
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
      <div className="col-span-1">
        <h2>{room}</h2>
        <form onSubmit={handleCreateRoom}>
          <fieldset>
            <label htmlFor="new-room" className="text-stone-500 text-sm mb-2">
              New Room
            </label>
            <input id="new-room" value={newRoom} onChange={(e) => setNewRoom(e.target.value)}></input>
          </fieldset>
          <button
            type="submit"
            className="ml-auto bg-cyan-500 border-2 border-b-4 border-cyan-600 text-stone-100 rounded-lg h-10 px-2 font-bold active:bg-cyan-600 active:border-b-2 hover:border-b-[5px]"
          >
            Create
          </button>
        </form>
      </div>
      <div className="col-span-2 flex flex-col gap-4">
        <ChatList messages={messages} currentUser={user!} />
        <form onSubmit={handleSendMessage} className="flex flex-col">
          <fieldset className="flex flex-col mb-6">
            <label htmlFor="message" className="text-stone-500 text-sm mb-2">
              Message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-16 py-2 px-4 rounded-lg focus:outline-none border border-stone-200 resize-y"
            ></textarea>
          </fieldset>
          <button
            type="submit"
            className="ml-auto bg-cyan-500 border-2 border-b-4 border-cyan-600 text-stone-100 rounded-lg h-10 px-2 font-bold active:bg-cyan-600 active:border-b-2 hover:border-b-[5px]"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  )
}
