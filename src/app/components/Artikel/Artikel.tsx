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
          <article key={artikel.id} style={styles.card} tabIndex={0} aria-label={artikel.judul}>
            <h2 style={styles.cardTitle}>{artikel.judul}</h2>
            <p style={styles.cardContent}>{artikel.isi}</p>
          </article>
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
    backgroundColor: '#f0f9f4',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: '0 20px 60px',
    color: '#1a1a1a',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    textAlign: 'center',
    padding: '60px 15px 30px',
  },
  headerTitle: {
    fontSize: '3rem',
    fontWeight: 900,
    color: '#2d6a4f',
    marginBottom: '12px',
    lineHeight: 1.1,
  },
  subtitle: {
    fontSize: '1.25rem',
    color: '#4a4a4a',
    maxWidth: 480,
    margin: '0 auto',
    fontWeight: 500,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '36px',
    maxWidth: 960,
    width: '100%',
    margin: '40px auto 0',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '28px 30px',
    borderRadius: 16,
    border: '1px solid #a7d7a7',
    boxShadow: '0 6px 20px rgba(45, 106, 79, 0.15)',
    whiteSpace: 'pre-wrap',
    cursor: 'default',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    outline: 'none',

    // Hover & Focus effect
  },
  cardTitle: {
    fontSize: '1.8rem',
    fontWeight: 700,
    marginBottom: 18,
    color: '#1b4332',
  },
  cardContent: {
    fontSize: '1.05rem',
    lineHeight: 1.7,
    color: '#333',
  },
  footer: {
    textAlign: 'center',
    padding: '30px 15px',
    fontSize: 14,
    color: '#666',
    borderTop: '1px solid #ddd',
    marginTop: 'auto',
  },
};

export default Artikel;
