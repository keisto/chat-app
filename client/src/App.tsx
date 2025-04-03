import { SessionProvider } from './context/SessionContext'
import Authenticate from './components/Authenticate'

function App() {
  return (
    <SessionProvider>
      <main>
        <header>
          <h1>Chat App</h1>
          <Authenticate />
        </header>
      </main>
    </SessionProvider>
  )
}

export default App
