'use client';

import React, { useState } from 'react';
import TipsIbadah from './TipsIbadah';
import Ceramah from './Ceramah';
import Fiqih from './Fiqih';

const ArtikelMenu: React.FC = () => {
  const [activeArticle, setActiveArticle] = useState<string | null>(null);

  const articleItems = [
    {
      key: 'tips-ibadah',
      category: 'Tips Ibadah',
      title: 'Tips Ibadah',
      image: '/sholat.jpg',
    },
    {
      key: 'ceramah',
      category: 'Ceramah Singkat',
      title: 'Ceramah Singkat',
      image: '/ceramah.jpg',
    },
    {
      key: 'fiqih',
      category: 'Fiqih Sehari-hari',
      title: 'Fiqih Sehari-hari',
      image: '/fiqih.jpg',
    },
  ];

  const renderActiveContent = () => {
    switch (activeArticle) {
      case 'tips-ibadah':
        return <TipsIbadah />;
      case 'ceramah':
        return <Ceramah />;
      case 'fiqih':
        return <Fiqih />;
      default:
        return null;
    }
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>📚 Artikel Islami</h1>
      </header>

      {!activeArticle && (
        <>
          <p style={styles.subtitle}>Pilih artikel untuk membaca lebih lanjut</p>
          <main style={styles.grid}>
            {articleItems.map((item) => (
              <div
                key={item.key}
                style={styles.cardContainer}
                onClick={() => setActiveArticle(item.key)}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  style={styles.thumbnail}
                />
                <div style={styles.cardContent}>
                  <span style={styles.category}>{item.category}</span>
                  <h3 style={styles.title}>{item.title}</h3>
                  <span style={styles.readMore}>
                    Read more <span style={{ fontSize: 16 }}>→</span>
                  </span>
                </div>
              </div>
            ))}
          </main>
        </>
      )}

      {activeArticle && (
        <div style={{ marginTop: 30 }}>
          {renderActiveContent()}

          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <button style={styles.backButton} onClick={() => setActiveArticle(null)}>
              &larr; Kembali ke Daftar Artikel
            </button>
          </div>
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
    fontSize: '2.5rem',
    color: '#2c7a7b',
    fontWeight: 700,
  },
  subtitle: {
    color: '#555',
    fontSize: '1.1rem',
    marginBottom: 24,
  },
  grid: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 20,
    maxWidth: 720,
    margin: '0 auto',
  },
  cardContainer: {
    display: 'flex',
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
  },
  thumbnail: {
    width: 120,
    height: 100,
    objectFit: 'cover' as const,
    flexShrink: 0,
  },
  cardContent: {
    padding: 16,
    flex: 1,
    textAlign: 'left' as const,
  },
  category: {
    display: 'inline-block',
    fontSize: 12,
    color: '#555',
    backgroundColor: '#f1f1f1',
    borderRadius: 12,
    padding: '2px 10px',
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: 600,
    margin: '4px 0 12px',
    color: '#222',
  },
  readMore: {
    fontSize: 14,
    color: '#2c7a7b',
    fontWeight: 500,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
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
