import React from 'react';

interface ArticleProps {
  article: {
    judul: string;
    gambar_artikel: string;
    sumber: string;
    isi_artikel: string;
    tanggal_artikel: string;
  };
}

const ArticleView: React.FC<ArticleProps> = ({ article }) => {
  return (
    <div className="max-w-3xl mx-auto mt-5 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
      <div className="w-full aspect-[16/9] bg-gray-100">
      <img
        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${article.gambar_artikel}`}
        alt={article.judul}
        className="w-full h-full object-contain"
      />
      </div>
      <div className="p-6 text-left">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
        {article.judul}
      </h1>
      <p className="text-sm text-gray-500 mb-4 italic">Sumber: {article.sumber}</p>
      <p className="text-sm text-gray-500 mb-4">{new Date(article.tanggal_artikel).toLocaleDateString('id-ID')}</p>
      <div
        className="text-gray-700 space-y-4"
        style={{ whiteSpace: 'pre-line' }}
      >
        {article.isi_artikel}
      </div>
      </div>
    </div>
  );
};

export default ArticleView; 