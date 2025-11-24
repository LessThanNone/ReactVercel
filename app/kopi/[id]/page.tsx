"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import Footer from "../../components/footer";

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

type Kopi = {
  id: number;
  nama: string;
  notes?: string;
  aroma?: string;
  acidity?: string;
  seduh?: string;
  createdAt?: string;
  updatedAt?: string;
};

type KopiForm = {
  nama: string;
  notes?: string;
  aroma?: string;
  acidity?: string;
  seduh?: string;
};

export default function DetailKopiPage() {
  const params = useParams();
  const id = params?.id as string;
  
  const [kopi, setKopi] = useState<Kopi | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<KopiForm>({ 
    nama: '', 
    notes: '', 
    aroma: '', 
    acidity: '', 
    seduh: '' 
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) {
        setKopi(null);
        setLoading(false);
        setErrorMessage('ID tidak valid');
        return;
      }

      setLoading(true);
      setErrorMessage(null);
      
      try {
        const res = await fetch(`/api/kopi/${id}`);
        
        if (!res.ok) {
          if (res.status === 404) {
            setErrorMessage('Kopi tidak ditemukan');
          } else {
            setErrorMessage('Gagal memuat data kopi');
          }
          setKopi(null);
          return;
        }

        const data: Kopi = await res.json();
        setKopi(data);
        setForm({ 
          nama: data.nama || '', 
          notes: data.notes || '', 
          aroma: data.aroma || '', 
          acidity: data.acidity || '', 
          seduh: data.seduh || '' 
        });
      } catch (e) {
        console.error('Error loading data:', e);
        setKopi(null);
        setErrorMessage('Terjadi kesalahan saat memuat data');
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleSave = async () => {
    if (!form.nama.trim()) {
      alert('Nama wajib diisi');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/kopi/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Gagal menyimpan');
      }

      const updated: Kopi = await res.json();
      setKopi(updated);
      setEditMode(false);
      alert('Berhasil menyimpan perubahan!');
    } catch (e) {
      console.error(e);
      alert(e instanceof Error ? e.message : 'Gagal menyimpan perubahan');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!kopi) return;
    
    if (!confirm(`Hapus kopi "${kopi.nama}"?`)) return;

    try {
      const res = await fetch(`/api/kopi/${id}`, { method: 'DELETE' });
      
      if (!res.ok && res.status !== 204) {
        throw new Error('Gagal menghapus');
      }

      alert('Kopi berhasil dihapus!');
      window.location.href = '/kopi';
    } catch (e) {
      console.error(e);
      alert('Gagal menghapus kopi');
    }
  };

  const handleCancel = () => {
    if (!kopi) return;
    setEditMode(false);
    setForm({ 
      nama: kopi.nama, 
      notes: kopi.notes || '', 
      aroma: kopi.aroma || '', 
      acidity: kopi.acidity || '', 
      seduh: kopi.seduh || '' 
    });
  };

  if (loading) {
    return (
      <>
        <div className="container mt-5" style={{ maxWidth: "700px" }}>
          <p className="text-center text-muted">Loading...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!kopi) {
    return (
      <>
        <div className="container mt-5" style={{ maxWidth: "700px" }}>
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Kopi Tidak Ditemukan</h4>
            {errorMessage && <p className="mb-0">{errorMessage}</p>}
          </div>
          <Link href="/kopi" className="btn btn-dark">
            Kembali ke Daftar Kopi
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <div className="container mt-5" style={{ maxWidth: "700px" }}>
        <div className="card p-4 shadow-sm">
          {!editMode ? (
            <>
              <h3 className="mb-3">{kopi.nama}</h3>

              <div className="mb-2">
                <strong>Notes Rasa:</strong> {kopi.notes || "-"}
              </div>
              <div className="mb-2">
                <strong>Aroma:</strong> {kopi.aroma || "-"}
              </div>
              <div className="mb-2">
                <strong>Acidity:</strong> {kopi.acidity || "-"}
              </div>
              <div className="mb-2">
                <strong>Metode Seduh:</strong> {kopi.seduh || "-"}
              </div>

              {kopi.createdAt && (
                <div className="mt-3 text-muted small">
                  <div>Dibuat: {new Date(kopi.createdAt).toLocaleString('id-ID')}</div>
                  {kopi.updatedAt && (
                    <div>Diupdate: {new Date(kopi.updatedAt).toLocaleString('id-ID')}</div>
                  )}
                </div>
              )}

              <div className="d-flex gap-2 mt-4">
                <button 
                  className="btn btn-secondary" 
                  onClick={() => setEditMode(true)}
                >
                  Edit
                </button>
                <Link href="/kopi" className="btn btn-dark ms-auto">
                  Kembali ke List Kopi
                </Link>
              </div>
            </>
          ) : (
            <>
              <h4 className="mb-3">Edit Kopi</h4>
              
              <div className="mb-3">
                <label className="form-label">Nama Kopi</label>
                <input 
                  type="text" 
                  name="nama" 
                  className="form-control" 
                  value={form.nama} 
                  onChange={(e) => setForm({ ...form, nama: e.target.value })} 
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Notes Rasa</label>
                <input 
                  type="text" 
                  name="notes" 
                  className="form-control" 
                  placeholder="Cth: Fruity, Caramel"
                  value={form.notes} 
                  onChange={(e) => setForm({ ...form, notes: e.target.value })} 
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Aroma</label>
                  <input 
                    type="text" 
                    name="aroma" 
                    className="form-control" 
                    placeholder="Cth: Floral, Chocolate"
                    value={form.aroma} 
                    onChange={(e) => setForm({ ...form, aroma: e.target.value })} 
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Acidity</label>
                  <input 
                    type="text" 
                    name="acidity" 
                    className="form-control" 
                    placeholder="Cth: Low, Medium, High"
                    value={form.acidity} 
                    onChange={(e) => setForm({ ...form, acidity: e.target.value })} 
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Metode Seduh</label>
                <input 
                  type="text" 
                  name="seduh" 
                  className="form-control" 
                  placeholder="Cth: V60, Aeropress"
                  value={form.seduh} 
                  onChange={(e) => setForm({ ...form, seduh: e.target.value })} 
                />
              </div>

              <div className="d-flex gap-2">
                <button 
                  className="btn btn-primary" 
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? 'Menyimpan...' : 'Simpan'}
                </button>

                <button 
                  className="btn btn-outline-secondary" 
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Batal
                </button>

                <button 
                  className="btn btn-danger ms-auto" 
                  onClick={handleDelete}
                  disabled={saving}
                >
                  Hapus
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}