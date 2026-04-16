'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <main style={{ padding: '4rem 1rem', textAlign: 'center' }}>
          <h1>Critical error</h1>
          <p>The application encountered a critical error. Please try again.</p>
          <button onClick={() => reset()}>Try again</button>
        </main>
      </body>
    </html>
  )
}
