import { useState } from 'react'

type Props = {
  handleClose: () => void
  handleSignIn: (username: string) => Promise<void>
}

export default function AuthenticateModal({ handleClose, handleSignIn }: Props) {
  const [username, setUsername] = useState('')

  return (
    <div
      style={{
        position: 'absolute',
        zIndex: 100,
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        background: 'lightgray',
        padding: '12px',
      }}
      onClick={(e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
          handleClose()
        }
      }}
    >
      <div>
        <fieldset>
          <label htmlFor="username" className="text-gray-700 text-sm mb-2">
            Username
          </label>
          <input
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            type="text"
            name="username"
            placeholder="Username"
          />
        </fieldset>
        <button onClick={() => handleSignIn(username)}>Sign In</button>
      </div>
    </div>
  )
}
