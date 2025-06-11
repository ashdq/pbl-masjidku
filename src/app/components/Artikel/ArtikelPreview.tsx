'use client';

import React, { useState, useEffect } from 'react';
import ArticleView from '@/app/components/Artikel/ArticleView';
import TambahArtikel from '@/app/components/Artikel/TambahArtikel';
import { Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';

interface Article {
  id: number;
  judul: string;
  gambar_artikel: string;
  sumber: string;
  isi_artikel: string;
  tanggal_artikel: string;
}

const ArtikelMenu: React.FC = () => {
  const [activeArticle, setActiveArticle] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [newArticle, setNewArticle] = useState({
    judul: '',
    sumber: '',
    gambar_artikel: null as File | null,
    isi_artikel: '',
    tanggal_artikel: ''
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [mounted, setMounted] = useState(false);
  const [userRole, setUserRole] = useState<string>('warga'); // default warga

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      fetchArticles();
    }
  }, [mounted]);

  useEffect(() => {
    // Ambil role dari localStorage (default 'warga' jika tidak ada)
    const role = localStorage.getItem('role') || 'warga';
    setUserRole(role);
  }, []);

  const fetchArticles = async () => {
    try {
      setIsLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
      const response = await fetch(`${baseUrl}/api/artikel`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch articles');
      }

      const responseData = await response.json();
      
      if (responseData.status === 'success' && responseData.data) {
        setArticles(responseData.data);
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
      setError(error instanceof Error ? error.message : 'Failed to load articles');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Validate file type
      if (!file.type.match('image/(jpeg|png|jpg)')) {
        setError('Format file harus jpeg, png, atau jpg');
        return;
      }
      // Validate file size (2MB)
      if (file.size > 2 * 1024 * 1024) {
        setError('Ukuran file maksimal 2MB');
        return;
      }
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Fetch CSRF cookie
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sanctum/csrf-cookie`, {
        credentials: 'include',
      });

      // Get XSRF-TOKEN from cookie
      const xsrfToken = getCookie('XSRF-TOKEN') || '';

      const formDataToSend = new FormData();
      Object.entries(newArticle).forEach(([key, value]) => {
        if (
          key !== 'gambar_artikel' && // Skip gambar_artikel from newArticle
          value !== undefined &&
          value !== null
        ) {
          formDataToSend.append(key, value);
        }
      });

      // Only append gambar_artikel if user selected a new image
      if (selectedImage) {
        formDataToSend.append('gambar_artikel', selectedImage);
      }

      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
      const response = await fetch(`${baseUrl}/api/artikel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'X-XSRF-TOKEN': decodeURIComponent(xsrfToken), // Include XSRF token
        },
        body: formDataToSend,
        credentials: 'include', // Ensure cookies are sent
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create article');
      }

      await fetchArticles();
      setShowAddForm(false);
      resetForm();
      alert('Artikel berhasil ditambahkan');
    } catch (error) {
      console.error('Error creating article:', error);
      setError(error instanceof Error ? error.message : 'Failed to create article');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data artikel akan dihapus dan tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            throw new Error('No authentication token found');
          }

          // Fetch CSRF cookie
          await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sanctum/csrf-cookie`, {
            credentials: 'include',
          });

          // Get XSRF-TOKEN from cookie
          const xsrfToken = getCookie('XSRF-TOKEN') || '';

          const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
          const response = await fetch(`${baseUrl}/api/artikel/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json',
              'X-XSRF-TOKEN': decodeURIComponent(xsrfToken), // Include XSRF token
            },
            credentials: 'include', // Ensure cookies are sent
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Gagal menghapus artikel');
          }

          fetchArticles();

          Swal.fire({
            title: "Berhasil!",
            text: "Artikel berhasil dihapus.",
            icon: "success"
          });
        } catch (error) {
          console.error('Error deleting article:', error);
          setError(error instanceof Error ? error.message : 'Terjadi kesalahan saat menghapus artikel');

          Swal.fire({
            title: "Gagal!",
            text: "Terjadi kesalahan saat menghapus artikel.",
            icon: "error"
          });
        }
      }
    });
  };

  // Helper function to get cookie
  function getCookie(name: string): string {
    if (typeof document === 'undefined') return '';
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || '';
    return '';
  }

  const resetForm = () => {
    setNewArticle({
      judul: '',
      sumber: '',
      gambar_artikel: null,
      isi_artikel: '',
      tanggal_artikel: ''
    });
    setSelectedImage(null);
    setPreviewUrl('');
    setError('');
  };

  const renderActiveContent = () => {
    if (!activeArticle) return null;
    
    const article = articles.find(a => a.id.toString() === activeArticle);
    if (!article) return null;

    return <ArticleView article={article} />;
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
            {/* Tampilkan tombol tambah hanya untuk admin/takmir */}
            {(userRole === 'admin' || userRole === 'takmir') && (
              <button
                style={styles.addButton}
                onClick={() => setShowAddForm(true)}
              >
                + Tambah Artikel
              </button>
            )}
          </div>
          <TambahArtikel
            showAddForm={showAddForm}
            setShowAddForm={setShowAddForm}
            newArticle={newArticle}
            setNewArticle={setNewArticle}
            handleImageChange={handleImageChange}
            handleSubmit={handleSubmit}
          />

          <main
            style={{
              width: '100%',
              maxWidth: 1400,
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 32,
              alignItems: 'stretch',
            }}
          >
            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
            ) : error ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>{error}</div>
            ) : articles.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
              Belum ada artikel. Yuk, tambahkan artikel pertama!
              </div>
            ) : (
              <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 24,
                width: '100%',
                maxWidth: 900,
                margin: '0 auto',
              }}
              >
              {articles
              .sort((a, b) => new Date(b.tanggal_artikel).getTime() - new Date(a.tanggal_artikel).getTime())
              .map((article) => (
                <div
                  key={article.id}
                  style={{
                    ...styles.cardContainer,
                    flexDirection: 'row',
                    minHeight: 180,
                    alignItems: 'stretch',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 2px 12px rgba(44, 122, 123, 0.10)',
                    transition: 'box-shadow 0.2s, transform 0.2s',
                    cursor: 'pointer',
                    position: 'relative',
                    background: 'white',
                    width: '100%',
                    margin: 0,
                    padding: 0,
                    height: 'auto',
                    overflow: 'visible',
                  }}
                  onClick={() => setActiveArticle(article.id.toString())}
                  onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 8px 24px rgba(44, 122, 123, 0.15)')}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 2px 12px rgba(44, 122, 123, 0.10)')}
                >
                  <div
                  style={{
                    width: 180,
                    minWidth: 180,
                    height: 180,
                    background: '#f6f8fa',
                    overflow: 'hidden',
                    borderTopLeftRadius: 12,
                    borderBottomLeftRadius: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 0,
                  }}
                  >
                  <img
                    src={
                    article.gambar_artikel.startsWith('http')
                      ? article.gambar_artikel
                      : `${process.env.NEXT_PUBLIC_BACKEND_URL}/${article.gambar_artikel}`
                    }
                    alt={article.judul}
                    style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    display: 'block',
                    borderRadius: 0,
                    transition: 'transform 0.3s',
                    }}
                    loading="lazy"
                  />
                  </div>
                  <div style={{
                  ...styles.cardContent,
                  padding: 24,
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minWidth: 0,
                  minHeight: 0,
                  position: 'relative',
                  overflow: 'visible',
                  maxHeight: 'none',
                  }}>
                  <div>
                    <span style={{ ...styles.category, marginBottom: 6, fontSize: 13 }}>Artikel</span>
                    <h3
                    style={{
                      ...styles.title,
                      fontSize: 20,
                      margin: '6px 0 12px',
                      color: '#234e52',
                      lineHeight: 1.25,
                      minHeight: 28,
                      overflow: 'visible',
                      textOverflow: 'unset',
                      display: 'block',
                      WebkitLineClamp: 'unset',
                      WebkitBoxOrient: 'unset',
                      whiteSpace: 'normal',
                    }}
                    title={article.judul}
                    >
                    {article.judul}
                    </h3>
                    <div style={{ color: '#888', fontSize: 13, marginBottom: 6 }}>
                    {new Date(article.tanggal_artikel).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                    </div>
                    <div
                    style={{
                      color: '#444',
                      fontSize: 15,
                      marginBottom: 10,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      minHeight: 32,
                      lineHeight: 1.5,
                      whiteSpace: 'normal',
                      maxHeight: 48,
                    }}
                    >
                    {article.isi_artikel}
                    </div>
                  </div>
                  <div style={{
                    ...styles.cardActions,
                    marginTop: 16,
                    borderTop: '1px solid #f1f1f1',
                    paddingTop: 10,
                    minHeight: 38,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'white',
                    borderBottomRightRadius: 12,
                    borderTopRightRadius: 0,
                    paddingLeft: 0,
                    paddingRight: 0,
                    position: 'static',
                  }}>
                    <span style={{ ...styles.readMore, fontSize: 15, cursor: 'pointer' }}>
                      <span style={{
                        background: '#e6fffa',
                        color: '#2c7a7b',
                        borderRadius: 6,
                        padding: '4px 12px',
                        fontWeight: 600,
                        fontSize: 15,
                        boxShadow: '0 1px 2px rgba(44,122,123,0.04)',
                        transition: 'background 0.2s',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                      }}>
                        Baca Selengkapnya <span style={{ fontSize: 18 }}>→</span>
                      </span>
                    </span>
                    {/* Tombol hapus hanya untuk admin/takmir */}
                    {(userRole === 'admin' || userRole === 'takmir') && (
                      <button
                        title="Hapus artikel"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#e53e3e',
                          cursor: 'pointer',
                          padding: 6,
                          marginLeft: 10,
                          borderRadius: 8,
                          transition: 'background 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                        onClick={e => {
                          e.stopPropagation();
                          handleDelete(article.id);
                        }}
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>
                  </div>
                </div>
                ))}
              </div>
            )}
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
  cardActions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
};

export default ArtikelMenu;
