import { SessionProvider } from './context/SessionContext'
import Authenticate from './components/Authenticate'
import Chat from './components/Chat'

function App() {
  return (
    <SessionProvider>
      <div>
        <header>
          <h1>Chat App</h1>
          <Authenticate />
        </header>
        <main>
          <Chat />
        </main>
      </div>
    </SessionProvider>
  )
}

export default App
