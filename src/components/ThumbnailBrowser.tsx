import { ComicPage } from '../types';

interface ThumbnailBrowserProps {
  comic: ComicPage[];
  currentPage: number;
  onSelectPage: (index: number) => void;
  onClose: () => void;
}

export default function ThumbnailBrowser({
  comic,
  currentPage,
  onSelectPage,
  onClose,
}: ThumbnailBrowserProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <i className="fas fa-th-large"></i>
          Thumbnail Browser
          <span className="text-sm text-white/50 ml-2">({comic.length} pages)</span>
        </h2>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded transition-colors"
        >
          <i className="fas fa-times mr-1"></i> Close (T)
        </button>
      </div>

      {/* Progress bar */}
      <div className="px-4 pt-2">
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${((currentPage + 1) / comic.length) * 100}%` }}
          />
        </div>
        <div className="text-xs text-white/50 mt-1">
          Page {currentPage + 1} of {comic.length}
        </div>
      </div>

      {/* Thumbnails Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {comic.map((page, index) => (
            <div
              key={page.id}
              onClick={() => onSelectPage(index)}
              className={`relative cursor-pointer group transition-all duration-200 hover:scale-105 ${
                index === currentPage
                  ? 'ring-2 ring-blue-500 rounded-lg'
                  : 'hover:ring-1 hover:ring-white/30 rounded-lg'
              }`}
            >
              <div className="aspect-[2/3] bg-gray-800 rounded-lg overflow-hidden">
                <img
                  src={page.image}
                  alt={page.title || `Page ${index + 1}`}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </div>
              {/* Page number overlay */}
              <div className={`absolute bottom-0 left-0 right-0 p-1 text-center text-xs rounded-b-lg ${
                index === currentPage ? 'bg-blue-600/90' : 'bg-black/70 group-hover:bg-black/90'
              }`}>
                {index + 1}
              </div>
              {/* Current page indicator */}
              {index === currentPage && (
                <div className="absolute top-1 right-1">
                  <i className="fas fa-eye text-blue-400 text-xs"></i>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-white/10 text-center text-xs text-white/40">
        Double-click a thumbnail to open at that page · Press T or Esc to close
      </div>
    </div>
  );
}
