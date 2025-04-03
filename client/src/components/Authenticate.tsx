import { useState } from 'react'
import { useSession } from '../context/SessionContext'
import AuthenticateModal from './AuthenticateModal'
import { createPortal } from 'react-dom'

export default function Authenticate() {
  const { user, isAuthenticated, signIn, signOut } = useSession()
  const [showModal, setShowModal] = useState(false)

  const handleSignIn = async (username: string) => {
    await signIn(username)
    setShowModal(false)
  }

  return (
    <>
      {isAuthenticated ? (
        <div>
          <p>Welcome: {user?.username}</p>
          <button onClick={signOut}>Sign Out</button>
        </div>
      ) : (
        <button onClick={() => setShowModal(true)}>Sign In</button>
      )}

      {showModal &&
        createPortal(
          <AuthenticateModal handleClose={() => setShowModal(false)} handleSignIn={handleSignIn} />,
          document.body
        )}
    </>
  )
}
