import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ textAlign: 'center', maxWidth: 820, width: '100%', padding: 28 }}>

        <h1 style={{ fontSize: 64, margin: '18px 0 6px', lineHeight: 1 }}>404</h1>
        <h2 style={{ margin: 0, fontSize: 20, color: '#333' }}>Halaman tidak ditemukan</h2>

        <p style={{ color: '#666', maxWidth: 640, margin: '12px auto 18px' }}>
          Maaf. halaman yang Anda cari tidak tersedia. Mungkin alamatnya salah.
        </p>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 12 }}>
          <Link href="/kopi" className="btn btn-dark" scroll={false}>Lihat Daftar Kopi</Link>
          <Link href="/" className="btn btn-outline-secondary">Kembali ke Beranda</Link>
        </div>
      </div>
    </div>
  );
}
