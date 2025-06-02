'use client';

import React, { useState } from 'react';
import TipsIbadah from './TipsIbadah';
import Ceramah from './Ceramah';
import Fiqih from './Fiqih';

const ArtikelMenu: React.FC = () => {
  const [activeArticle, setActiveArticle] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newArticle, setNewArticle] = useState({
    title: '',
    source: '',
    image: null as File | null,
    content: ''
  });

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewArticle({ ...newArticle, image: e.target.files[0] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically handle the form submission
    // For now, we'll just close the form
    setShowAddForm(false);
    setNewArticle({ title: '', source: '', image: null, content: '' });
  };

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
          <div style={styles.headerActions}>
            <p style={styles.subtitle}>Pilih artikel untuk membaca lebih lanjut</p>
            <button 
              style={styles.addButton} 
              onClick={() => setShowAddForm(true)}
            >
              + Tambah Artikel
            </button>
          </div>

          {showAddForm && (
            <div style={styles.formOverlay}>
              <div style={styles.formContainer}>
                <h2 style={styles.formTitle}>Tambah Artikel Baru</h2>
                <form onSubmit={handleSubmit} style={styles.form}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Judul Artikel</label>
                    <input
                      type="text"
                      value={newArticle.title}
                      onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                      style={styles.input}
                      required
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Sumber</label>
                    <input
                      type="text"
                      value={newArticle.source}
                      onChange={(e) => setNewArticle({ ...newArticle, source: e.target.value })}
                      style={styles.input}
                      required
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Konten</label>
                    <textarea
                      value={newArticle.content}
                      onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
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
          )}

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
  headerActions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    maxWidth: 720,
    margin: '0 auto 24px',
  },
  addButton: {
    backgroundColor: '#2c7a7b',
    color: 'white',
    padding: '10px 20px',
    borderRadius: 8,
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 500,
    transition: 'background-color 0.3s ease',
  } as React.CSSProperties,
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
  } as React.CSSProperties,
  formContainer: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 12,
    width: '100%',
    maxWidth: 500,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
  },
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
  },
  textarea: {
    padding: '10px 12px',
    borderRadius: 8,
    border: '1px solid #ddd',
    fontSize: '1rem',
    resize: 'vertical',
    minHeight: '150px',
    fontFamily: 'inherit',
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

export default ArtikelMenu;
