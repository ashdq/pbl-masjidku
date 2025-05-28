'use client';

import React, { useState } from 'react';
import TipsIbadah from './TipsIbadah';
import Ceramah from './Ceramah';
import Fiqih from './Fiqih';

const ArtikelMenu: React.FC = () => {
  const [activeArticle, setActiveArticle] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const menuItems = [
    { key: 'tips-ibadah', title: 'Tips Ibadah' },
    { key: 'ceramah', title: 'Ceramah Singkat' },
    { key: 'fiqih', title: 'Fiqih Sehari-hari' },
  ];

  const renderArticleContent = () => {
    switch (activeArticle) {
      case 'tips-ibadah':
        return <TipsIbadah />;
      case 'ceramah':
        return <Ceramah />;
      case 'fiqih':
        return <Fiqih />;
      default:
        return (
          <>
            <p style={styles.subtitle}>Pilih kategori untuk melihat isi lengkap</p>
            <main style={styles.grid}>
              {menuItems.map((item) => (
                <div
                  key={item.key}
                  style={{
                    ...styles.card,
                    transform: hovered === item.key ? 'translateY(-8px)' : 'translateY(0)',
                    boxShadow: hovered === item.key ? '0 8px 20px rgba(0,0,0,0.15)' : '0 4px 12px rgba(0,0,0,0.1)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  }}
                  onClick={() => setActiveArticle(item.key)}
                  onMouseEnter={() => setHovered(item.key)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <h2 style={styles.cardTitle}>{item.title}</h2>
                </div>
              ))}
            </main>
          </>
        );
    }
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 className="text-4xl font-bold text-teal-700 mb-6 text-center">📚 Artikel Islami</h1>
      </header>

      {renderArticleContent()}

      {activeArticle && (
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <button style={styles.backButton} onClick={() => setActiveArticle(null)}>
            &larr; Kembali ke Kategori
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  page: {
    padding: 40,
    textAlign: 'center' as const,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: '#f9fafb',
    minHeight: '100vh',
  },
  header: {
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: '2.8rem',
    color: '#2c7a7b',
  },
  subtitle: {
    color: '#555',
    fontSize: '1.1rem',
    marginBottom: 24,
  },
  grid: {
    display: 'flex',
    flexDirection: 'column' as const, // menu ke bawah
    gap: 24,
    maxWidth: 360,
    margin: '0 auto',
  },
  card: {
    backgroundColor: 'white',
    padding: '20px 30px',
    borderRadius: 14,
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    userSelect: 'none' as 'none',
  },
  cardTitle: {
    fontSize: '1.4rem',
    color: '#22543d',
    fontWeight: '700' as const,
  },
  backButton: {
    backgroundColor: '#2c7a7b',
    color: 'white',
    padding: '10px 18px',
    borderRadius: 10,
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.3s ease',
  } as React.CSSProperties,
};

export default ArtikelMenu;
