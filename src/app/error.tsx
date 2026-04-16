'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main style={{ padding: '4rem 1rem', textAlign: 'center' }}>
      <h1>Something went wrong</h1>
      <p>We hit an unexpected error. Please try again.</p>
      <button onClick={() => reset()}>Try again</button>
    </main>
  )
}
