import { useState } from 'react'

import { SessionProvider } from './context/SessionContext'
import Authenticate from './components/Authenticate'

const DEFAULT_ROOM = 'General'

function App() {
  const [room, setRoom] = useState(DEFAULT_ROOM)
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
            <li></li>
          </ul>
        </main>
      </div>
    </SessionProvider>
  )
}

export default App
