'use client';

interface Props {
  error: Error;
  reset: () => void;
}

export default function NoteDetailsError({ error, reset }: Props) {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Oops!</h2>

      <p>
        {error.message}
      </p>

      <button
        onClick={reset}
        style={{
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          cursor: 'pointer',
          borderRadius: '4px',
          backgroundColor: '#0070f3',
          color: '#fff',
          border: 'none',
        }}
      >
        Try again
      </button>
    </div>
  );
}
