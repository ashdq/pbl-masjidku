import React from 'react';

interface TambahArtikelProps {
  showAddForm: boolean;
  setShowAddForm: (show: boolean) => void;
  newArticle: {
    judul: string;
    sumber: string;
    gambar_artikel: File | null;
    isi_artikel: string;
    tanggal_artikel: string;
  };
  setNewArticle: React.Dispatch<React.SetStateAction<{
    judul: string;
    sumber: string;
    gambar_artikel: File | null;
    isi_artikel: string;
    tanggal_artikel: string;
  }>>;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const TambahArtikel: React.FC<TambahArtikelProps> = ({
  showAddForm,
  setShowAddForm,
  newArticle,
  setNewArticle,
  handleImageChange,
  handleSubmit,
}) => {
  if (!showAddForm) return null;

  return (
    <div style={styles.formOverlay}>
      <div style={styles.formContainer}>
        <h2 style={styles.formTitle}>Tambah Artikel Baru</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Judul Artikel</label>
            <input
              type="text"
              value={newArticle.judul}
              onChange={(e) => setNewArticle({ ...newArticle, judul: e.target.value })}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Sumber</label>
            <input
              type="text"
              value={newArticle.sumber}
              onChange={(e) => setNewArticle({ ...newArticle, sumber: e.target.value })}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Tanggal Artikel</label>
            <input
              type="date"
              value={newArticle.tanggal_artikel}
              onChange={(e) => setNewArticle({ ...newArticle, tanggal_artikel: e.target.value })}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Konten</label>
            <textarea
              value={newArticle.isi_artikel}
              onChange={(e) => setNewArticle({ ...newArticle, isi_artikel: e.target.value })}
              style={styles.textarea}
              required
              rows={6}
              placeholder="Tulis isi artikel di sini..."
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Foto</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={styles.fileInput}
              required
            />
          </div>
          <div style={styles.formActions}>
            <button type="submit" style={styles.submitButton}>
              Simpan
            </button>
            <button
              type="button"
              style={styles.cancelButton}
              onClick={() => setShowAddForm(false)}
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  formOverlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: 20,
  } as React.CSSProperties,
  formContainer: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 12,
    width: '95%',
    maxWidth: 800,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
    maxHeight: '95vh',
    overflowY: 'auto',
  } as React.CSSProperties,
  formTitle: {
    fontSize: '1.5rem',
    color: '#2c7a7b',
    marginBottom: 24,
    textAlign: 'center' as const,
  } as React.CSSProperties,
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 20,
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 8,
  },
  label: {
    fontSize: '0.9rem',
    color: '#555',
    fontWeight: 500,
  },
  input: {
    padding: '10px 12px',
    borderRadius: 8,
    border: '1px solid #ddd',
    fontSize: '1rem',
    color: '#000',
  },
  textarea: {
    padding: '10px 12px',
    borderRadius: 8,
    border: '1px solid #ddd',
    fontSize: '1rem',
    resize: 'vertical',
    minHeight: '150px',
    fontFamily: 'inherit',
    color: '#000',
  } as React.CSSProperties,
  fileInput: {
    padding: '8px 0',
  },
  formActions: {
    display: 'flex',
    gap: 12,
    marginTop: 12,
  },
  submitButton: {
    backgroundColor: '#2c7a7b',
    color: 'white',
    padding: '12px 24px',
    borderRadius: 8,
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 500,
    flex: 1,
  } as React.CSSProperties,
  cancelButton: {
    backgroundColor: '#f1f1f1',
    color: '#555',
    padding: '12px 24px',
    borderRadius: 8,
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 500,
    flex: 1,
  } as React.CSSProperties,
};

export default TambahArtikel; 