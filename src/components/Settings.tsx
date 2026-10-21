import { AppSettings } from '../types';

interface SettingsProps {
  settings: AppSettings;
  onSettingsChange: (settings: AppSettings) => void;
  onClose: () => void;
}

export default function Settings({ settings, onSettingsChange, onClose }: SettingsProps) {
  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center" onClick={onClose}>
      <div
        className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <i className="fas fa-cog"></i> Settings
          </h2>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded transition-colors text-sm"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Display Section */}
          <section>
            <h3 className="text-sm font-semibold text-blue-400 mb-3 flex items-center gap-2">
              <i className="fas fa-display"></i> Display
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm">Language</label>
                <select
                  value={settings.language}
                  onChange={(e) => updateSetting('language', e.target.value)}
                  className="bg-gray-800 border border-white/10 rounded px-2 py-1 text-sm"
                >
                  <option value="en">English</option>
                  <option value="sv">Svenska</option>
                  <option value="de">Deutsch</option>
                  <option value="fr">Français</option>
                  <option value="es">Español</option>
                  <option value="it">Italiano</option>
                  <option value="pt">Português (BR)</option>
                  <option value="pl">Polski</option>
                  <option value="ru">Русский</option>
                  <option value="ja">日本語</option>
                  <option value="zh">中文</option>
                  <option value="ko">한국어</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm">Font Size</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="10"
                    max="24"
                    value={settings.fontSize}
                    onChange={(e) => updateSetting('fontSize', Number(e.target.value))}
                    className="w-24"
                  />
                  <span className="text-xs text-white/50 w-8">{settings.fontSize}px</span>
                </div>
              </div>
            </div>
          </section>

          {/* Reading Section */}
          <section>
            <h3 className="text-sm font-semibold text-green-400 mb-3 flex items-center gap-2">
              <i className="fas fa-book-reader"></i> Reading
            </h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm">Auto-detect panels</span>
                <input
                  type="checkbox"
                  checked={settings.autoDetectPanels}
                  onChange={(e) => updateSetting('autoDetectPanels', e.target.checked)}
                  className="w-4 h-4 rounded bg-gray-800 border-white/20"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm">Guided mode (panel by panel)</span>
                <input
                  type="checkbox"
                  checked={settings.guidedMode}
                  onChange={(e) => updateSetting('guidedMode', e.target.checked)}
                  className="w-4 h-4 rounded bg-gray-800 border-white/20"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm">Show whole page first</span>
                <input
                  type="checkbox"
                  checked={settings.showWholePageFirst}
                  onChange={(e) => updateSetting('showWholePageFirst', e.target.checked)}
                  className="w-4 h-4 rounded bg-gray-800 border-white/20"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm">Black borders around panels</span>
                <input
                  type="checkbox"
                  checked={settings.blackBorders}
                  onChange={(e) => updateSetting('blackBorders', e.target.checked)}
                  className="w-4 h-4 rounded bg-gray-800 border-white/20"
                />
              </label>
            </div>
          </section>

          {/* Slideshow Section */}
          <section>
            <h3 className="text-sm font-semibold text-purple-400 mb-3 flex items-center gap-2">
              <i className="fas fa-clock"></i> Slideshow
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm">Time per step</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={settings.slideshowTime}
                    onChange={(e) => updateSetting('slideshowTime', Number(e.target.value))}
                    className="w-24"
                  />
                  <span className="text-xs text-white/50 w-8">{settings.slideshowTime}s</span>
                </div>
              </div>
            </div>
          </section>

          {/* Navigation Section */}
          <section>
            <h3 className="text-sm font-semibold text-orange-400 mb-3 flex items-center gap-2">
              <i className="fas fa-keyboard"></i> Navigation
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm">Esc behavior</label>
                <select
                  value={settings.escBehavior}
                  onChange={(e) => updateSetting('escBehavior', e.target.value as AppSettings['escBehavior'])}
                  className="bg-gray-800 border border-white/10 rounded px-2 py-1 text-sm"
                >
                  <option value="leave-fullscreen">Leave fullscreen</option>
                  <option value="ask">Ask first</option>
                  <option value="exit">Exit right away</option>
                </select>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 flex justify-between items-center">
          <span className="text-xs text-white/40">AutoComix v2.20.0</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors text-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
