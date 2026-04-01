import React from 'react';

const ComingSoon: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-6">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Ikon atau Logo */}
        <div className="flex justify-center">
          <div className="p-4 bg-white rounded-full animate-bounce">
            <img src="/icon.png" alt="logo" />
          </div>
        </div>

        {/* Konten Utama */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Something Great is <span className="text-indigo-400">Coming Soon</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Kami sedang bekerja keras untuk memberikan pengalaman terbaik. Sampai jumpa dalam waktu dekat!
          </p>
        </div>

        {/* Progress Bar Sederhana */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Progress</span>
            <span>75%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div className="bg-indigo-500 h-2.5 rounded-full w-[75%] shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
          </div>
        </div>

        {/* Footer/Kontak */}
        <div className="pt-8 border-t border-gray-800 text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} CBT Ujian Jepang. All rights reserved. Stay tuned!</p>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;