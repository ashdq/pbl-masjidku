import React from 'react';

interface ArtikelItem {
  id: number;
  judul: string;
  isi: string;
}

const daftarArtikel: ArtikelItem[] = [
  {
    id: 1,
    judul: 'Tips Ibadah',
    isi: `
🟢 Niat yang Ikhlas  
Awali setiap ibadah dengan niat tulus karena Allah SWT.

🟢 Menjaga Waktu Sholat  
Sholat di awal waktu adalah bukti kecintaan kepada Allah.

🟢 Membaca Al-Qur'an  
Luangkan waktu untuk membaca dan merenungi maknanya.

🟢 Dzikir dan Doa  
Jadikan dzikir sebagai penguat hati dan doa sebagai senjata.

🟢 Konsistensi  
Ibadah yang sedikit namun konsisten lebih dicintai Allah.
    `,
  },
  {
    id: 2,
    judul: 'Ceramah Singkat',
    isi: `
📖 "Hidup ini hanya sementara. Manfaatkan waktu untuk beribadah dan berbuat baik."

Rasulullah SAW bersabda:  
🌟 “Sebaik-baik manusia adalah yang paling bermanfaat bagi orang lain.” (HR. Ahmad)

Mari kita manfaatkan waktu sebaik-baiknya untuk memperbaiki diri, menjaga lisan, dan memperbanyak amal shaleh.  
Semoga Allah SWT memudahkan langkah kita menuju ridho-Nya.
    `,
  },
  {
    id: 3,
    judul: 'Fiqih Sehari-hari',
    isi: `
📌 Wudhu  
Basuh seluruh anggota wudhu dengan sempurna dan tertib.

📌 Sholat  
Kerjakan tepat waktu dan dengan khusyuk.

📌 Najis  
Kenali jenis najis (mukhaffafah, mutawassitah, mughallazah) dan cara membersihkannya.

📌 Muamalah  
Jujur dalam jual beli, jauhi riba, dan penuhi akad.

📌 Aurat  
Pahami batas aurat sesuai dengan syariat dalam kehidupan sehari-hari.
    `,
  },
];

const Artikel: React.FC = () => {
  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>📚 Artikel Islami</h1>
        <p style={styles.subtitle}>Inspirasi harian dalam menjalani hidup sesuai tuntunan Islam</p>
      </header>

      <main style={styles.grid}>
        {daftarArtikel.map((artikel) => (
          <div key={artikel.id} style={styles.card}>
            <h2 style={styles.cardTitle}>{artikel.judul}</h2>
            <p style={styles.cardContent}>{artikel.isi}</p>
          </div>
        ))}
      </main>

      <footer style={styles.footer}>
        <p>© {new Date().getFullYear()} Artikel Islami • Raden Ariq Resya Alauddine</p>
      </footer>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    backgroundColor: '#f7fdf8',
    fontFamily: 'Segoe UI, sans-serif',
    padding: '0 24px',
    color: '#111',
  },
  header: {
    textAlign: 'center',
    padding: '60px 20px 20px',
  },
  headerTitle: {
    fontSize: 40,
    fontWeight: 800,
    color: '#28a745',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#555',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    maxWidth: 900,
    margin: '40px auto',
    gap: 40,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 32,
    borderRadius: 20,
    border: '1px solid #d4edda',
    boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
    whiteSpace: 'pre-wrap',
    transition: 'transform 0.2s',
  },
  cardTitle: {
    fontSize: 26,
    fontWeight: 700,
    marginBottom: 18,
    color: '#1e4620',
  },
  cardContent: {
    fontSize: 17,
    lineHeight: 1.8,
    color: '#333',
  },
  footer: {
    textAlign: 'center',
    padding: '30px 0',
    fontSize: 14,
    color: '#999',
    borderTop: '1px solid #ddd',
    marginTop: 60,
  },
};

export default Artikel;
