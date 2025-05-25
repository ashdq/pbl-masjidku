import React, { useState } from 'react';

const Aspirasi: React.FC = () => {
  const [nama, setNama] = useState('');
  const [judul, setJudul] = useState('');
  const [isi, setIsi] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama || !judul || !isi) {
      alert('Semua field harus diisi!');
      return;
    }
    alert(`Aspirasi "${judul}" berhasil dikirim!`);
    setNama('');
    setJudul('');
    setIsi('');
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Form Aspirasi</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>
          Nama:
          <input
            type="text"
            value={nama}
            onChange={e => setNama(e.target.value)}
            style={styles.input}
            placeholder="Masukkan nama"
          />
        </label>

        <label style={styles.label}>
          Pilih Jenis Aspirasi:
          <select
            value={judul}
            onChange={e => setJudul(e.target.value)}
            style={styles.select}
          >
            <option value="">-- Pilih jenis aspirasi --</option>
            <option value="Infrastruktur">Infrastruktur</option>
            <option value="Pelayanan Publik">Pelayanan Publik</option>
            <option value="Lainnya">Lainnya</option>
          </select>
        </label>

        <label style={styles.label}>
          Isi Aspirasi:
          <textarea
            value={isi}
            onChange={e => setIsi(e.target.value)}
            style={styles.textarea}
            placeholder="Tulis aspirasi Anda di sini..."
          />
        </label>

        <button type="submit" style={styles.button}>
          Kirim Aspirasi
        </button>
      </form>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: 600,
    margin: '40px auto',
    padding: 25,
    border: '1px solid #ddd',
    borderRadius: 12,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: '#f9f9f9',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  header: {
    color: '#000',
    marginBottom: 25,
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 28,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: 18,
    fontWeight: '600',
    color: '#000',
    fontSize: 16,
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    marginTop: 6,
    borderRadius: 8,
    border: '1.8px solid #bbb',
    fontSize: 16,
    transition: 'border-color 0.3s ease',
    outline: 'none',
  },
  select: {
    width: '100%',
    padding: '10px 14px',
    marginTop: 6,
    borderRadius: 8,
    border: '1.8px solid #bbb',
    fontSize: 16,
    backgroundColor: '#fff',
    outline: 'none',
  },
  textarea: {
    width: '100%',
    height: 110,
    padding: 12,
    marginTop: 6,
    borderRadius: 8,
    border: '1.8px solid #bbb',
    fontSize: 16,
    resize: 'vertical',
    outline: 'none',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  button: {
  marginTop: 10,
  padding: '14px 0',
  backgroundColor: '#28a745', // hijau
  color: 'white',
  fontWeight: '700',
  fontSize: 18,
  border: 'none',
  borderRadius: 10,
  cursor: 'pointer',
  boxShadow: '0 3px 8px rgba(40, 167, 69, 0.6)',
  transition: 'background-color 0.3s ease',
},
'button:hover': {
  backgroundColor: '#218838', // Sedikit lebih gelap dari #28a745
},
};

export default Aspirasi;
