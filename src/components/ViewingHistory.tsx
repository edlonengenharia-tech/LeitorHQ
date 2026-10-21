import { ComicPage } from '../types';

interface HistoryEntry {
  pageId: string;
  pageIndex: number;
  panelIndex: number;
  timestamp: Date;
  title?: string;
}

interface ViewingHistoryProps {
  history: HistoryEntry[];
  comic: ComicPage[];
  onSelect: (pageIndex: number, panelIndex: number) => void;
  onClose: () => void;
}

export default function ViewingHistory({ history, comic: _comic, onSelect, onClose }: ViewingHistoryProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center" onClick={onClose}>
      <div
        className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <i className="fas fa-history text-purple-400"></i> Viewing History
          </h2>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded transition-colors text-sm"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* History List */}
        <div className="overflow-y-auto max-h-[60vh] p-2">
          {history.length === 0 ? (
            <div className="text-center py-8 text-white/40">
              <i className="fas fa-clock text-3xl mb-2"></i>
              <p>No viewing history yet</p>
            </div>
          ) : (
            <div className="space-y-1">
              {history.map((entry, index) => (
                <div
                  key={index}
                  onClick={() => {
                    onSelect(entry.pageIndex, entry.panelIndex);
                    onClose();
                  }}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors group"
                >
                  <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center text-xs text-white/50 group-hover:bg-blue-600/20 group-hover:text-blue-400 transition-colors">
                    {entry.pageIndex + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm truncate">{entry.title || `Page ${entry.pageIndex + 1}`}</div>
                    <div className="text-xs text-white/40">
                      Panel {entry.panelIndex + 1} · {entry.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                  <i className="fas fa-chevron-right text-white/20 group-hover:text-white/50 transition-colors"></i>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-white/10 text-center text-xs text-white/40">
          Last 20 positions · Ctrl+Shift+H to toggle
        </div>
      </div>
    </div>
  );
}

export type { HistoryEntry };
