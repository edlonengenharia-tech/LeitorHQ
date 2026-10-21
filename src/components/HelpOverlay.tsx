interface HelpOverlayProps {
  onClose: () => void;
}

export default function HelpOverlay({ onClose }: HelpOverlayProps) {
  const shortcuts = [
    { key: '→ / Space', action: 'Next panel/page' },
    { key: '←', action: 'Previous panel/page' },
    { key: 'F', action: 'Toggle fullscreen' },
    { key: 'T', action: 'Thumbnail browser' },
    { key: 'Ctrl+T', action: 'Thumbnail bar' },
    { key: 'H', action: 'Show this help' },
    { key: 'I', action: 'Information bar' },
    { key: 'R', action: 'Manga mode (right-to-left)' },
    { key: 'M', action: 'Magnifier' },
    { key: 'G', action: 'Guided mode' },
    { key: 'V', action: 'Whole page first' },
    { key: 'D', action: 'Black borders' },
    { key: 'Shift+D', action: 'Double page spread' },
    { key: 'E', action: 'Edit panels' },
    { key: 'X', action: 'Change reading order' },
    { key: 'Shift+X', action: 'Automatic order' },
    { key: '1-4', action: 'Fit mode (screen/width/height/100%)' },
    { key: '[ / ]', action: 'Rotate left/right' },
    { key: 'Ctrl+H', action: 'Slideshow on/off' },
    { key: 'N / B', action: 'Next/previous file' },
    { key: 'Ctrl+L', action: 'Last comic' },
    { key: 'Ctrl+B', action: 'Bookmark' },
    { key: 'Esc', action: 'Leave fullscreen / close panels' },
    { key: 'Ctrl+Q', action: 'Exit' },
  ];

  const magnifierShortcuts = [
    { key: 'Shift+Wheel', action: 'Change magnifier size' },
    { key: 'Ctrl+Wheel', action: 'Change magnification' },
  ];

  const slideshowShortcuts = [
    { key: 'Alt+↑', action: 'Longer time per step' },
    { key: 'Alt+↓', action: 'Shorter time per step' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={onClose}>
      <div
        className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <i className="fas fa-keyboard text-blue-400"></i> Keyboard Shortcuts
          </h2>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded transition-colors text-sm"
          >
            <i className="fas fa-times"></i> Esc
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Main Shortcuts */}
          <section>
            <h3 className="text-sm font-semibold text-blue-400 mb-3">Navigation & View</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
              {shortcuts.map(({ key, action }) => (
                <div key={key} className="flex items-center justify-between py-1 px-2 rounded hover:bg-white/5">
                  <kbd className="text-xs bg-gray-800 px-2 py-0.5 rounded border border-white/10 font-mono">
                    {key}
                  </kbd>
                  <span className="text-xs text-white/70 ml-2">{action}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Magnifier */}
          <section>
            <h3 className="text-sm font-semibold text-green-400 mb-3">Magnifier (M)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
              {magnifierShortcuts.map(({ key, action }) => (
                <div key={key} className="flex items-center justify-between py-1 px-2 rounded hover:bg-white/5">
                  <kbd className="text-xs bg-gray-800 px-2 py-0.5 rounded border border-white/10 font-mono">
                    {key}
                  </kbd>
                  <span className="text-xs text-white/70 ml-2">{action}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Slideshow */}
          <section>
            <h3 className="text-sm font-semibold text-purple-400 mb-3">Slideshow</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
              {slideshowShortcuts.map(({ key, action }) => (
                <div key={key} className="flex items-center justify-between py-1 px-2 rounded hover:bg-white/5">
                  <kbd className="text-xs bg-gray-800 px-2 py-0.5 rounded border border-white/10 font-mono">
                    {key}
                  </kbd>
                  <span className="text-xs text-white/70 ml-2">{action}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Mouse Controls */}
          <section>
            <h3 className="text-sm font-semibold text-orange-400 mb-3">Mouse Controls</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
              {[
                { key: 'Scroll', action: 'Next/Previous panel' },
                { key: 'Click edges', action: 'Next/Previous panel' },
                { key: 'Double-click panel', action: 'Zoom to panel' },
                { key: 'Right-click', action: 'Context menu' },
              ].map(({ key, action }) => (
                <div key={key} className="flex items-center justify-between py-1 px-2 rounded hover:bg-white/5">
                  <kbd className="text-xs bg-gray-800 px-2 py-0.5 rounded border border-white/10 font-mono">
                    {key}
                  </kbd>
                  <span className="text-xs text-white/70 ml-2">{action}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 text-center">
          <span className="text-xs text-white/40">
            AutoComix — Comic reader with automatic panel-by-panel zoom
          </span>
        </div>
      </div>
    </div>
  );
}
