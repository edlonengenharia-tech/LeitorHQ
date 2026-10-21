import { useState } from 'react';

interface WelcomeScreenProps {
  onStart: () => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    onStart();
  };

  return (
    <div
      className="h-screen w-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex flex-col items-center justify-center relative overflow-hidden"
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 50px,
            rgba(255,255,255,0.03) 50px,
            rgba(255,255,255,0.03) 51px
          ),
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent 50px,
            rgba(255,255,255,0.03) 50px,
            rgba(255,255,255,0.03) 51px
          )`,
        }} />
      </div>

      {/* Floating comic panels decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-lg border border-white/5 bg-white/[0.02]"
            style={{
              width: `${80 + i * 30}px`,
              height: `${120 + i * 40}px`,
              top: `${10 + i * 15}%`,
              left: `${5 + i * 16}%`,
              transform: `rotate(${-15 + i * 8}deg)`,
              animation: `float ${3 + i}s ease-in-out infinite alternate`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center max-w-2xl px-6">
        {/* Logo */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-2xl shadow-blue-500/20 mb-4">
            <i className="fas fa-book-open text-4xl text-white"></i>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            AutoComix
          </h1>
          <p className="text-white/50 mt-2 text-lg">
            Comic reader with automatic panel-by-panel zoom
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { icon: 'fa-th-large', label: 'Panel Detection', color: 'text-blue-400' },
            { icon: 'fa-expand', label: 'Fullscreen', color: 'text-green-400' },
            { icon: 'fa-search-plus', label: 'Magnifier', color: 'text-purple-400' },
            { icon: 'fa-book-open', label: 'Manga Mode', color: 'text-pink-400' },
          ].map(({ icon, label, color }) => (
            <div key={label} className="bg-white/5 rounded-lg p-3 border border-white/5">
              <i className={`fas ${icon} ${color} text-lg mb-1`}></i>
              <div className="text-xs text-white/60">{label}</div>
            </div>
          ))}
        </div>

        {/* Start button */}
        <button
          onClick={onStart}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl text-white font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20 mb-4"
        >
          <i className="fas fa-play mr-2"></i> Start Reading
        </button>

        <p className="text-white/30 text-sm">
          or drop a folder, archive (.cbz, .cbr), or PDF here
        </p>

        {/* Supported formats */}
        <div className="mt-6 flex items-center justify-center gap-4 text-xs text-white/30">
          <span className="px-2 py-1 bg-white/5 rounded">.CBZ</span>
          <span className="px-2 py-1 bg-white/5 rounded">.CBR</span>
          <span className="px-2 py-1 bg-white/5 rounded">.CB7</span>
          <span className="px-2 py-1 bg-white/5 rounded">.PDF</span>
          <span className="px-2 py-1 bg-white/5 rounded">Folders</span>
          <span className="px-2 py-1 bg-white/5 rounded">Images</span>
        </div>
      </div>

      {/* Drop overlay */}
      {isDragging && (
        <div className="absolute inset-0 bg-blue-600/20 border-4 border-dashed border-blue-400 z-50 flex items-center justify-center">
          <div className="text-center">
            <i className="fas fa-cloud-upload-alt text-6xl text-blue-400 mb-4"></i>
            <p className="text-xl text-blue-300">Drop to open</p>
          </div>
        </div>
      )}

      {/* Bottom info */}
      <div className="absolute bottom-4 text-center text-xs text-white/20">
        <p>AutoComix v2.20.0 — Open source under AGPL-3.0</p>
        <p className="mt-1">Press H for keyboard shortcuts</p>
      </div>

      <style>{`
        @keyframes float {
          from { transform: translateY(0) rotate(var(--rotation, 0deg)); }
          to { transform: translateY(-20px) rotate(var(--rotation, 0deg)); }
        }
      `}</style>
    </div>
  );
}
