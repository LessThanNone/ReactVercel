'use client'
import { useEffect } from 'react';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error('Unhandled error:', error);
  }, [error]);

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ textAlign: 'center', maxWidth: 720 }}>
        <h1 style={{ fontSize: 28, marginBottom: 8 }}>Terjadi Kesalahan</h1>
        <p style={{ color: '#666' }}>Maaf, terjadi masalah saat memuat halaman ini.</p>

        <pre style={{ background: '#f6f6f8', padding: 12, borderRadius: 8, color: '#333', overflowX: 'auto' }}>
          {error?.message}
        </pre>

        <div style={{ marginTop: 16 }}>
          <button onClick={() => reset()} className="btn btn-dark">
            Coba lagi
          </button>
        </div>
      </div>
    </div>
  );
}
