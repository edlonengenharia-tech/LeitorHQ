import { useState, useEffect } from 'react';
import { ComicPage, Panel, FitMode } from '../types';

interface ComicReaderProps {
  comic: ComicPage[];
  currentPage: number;
  currentPanel: number;
  panels: Panel[];
  totalPages: number;
  totalPanels: number;
  fitMode: FitMode;
  mangaMode: boolean;
  rotation: number;
  showDoublePage: boolean;
  editMode: boolean;
  blackBorders: boolean;
  showInfo: boolean;
  slideshowActive: boolean;
  onPanelClick: (e: React.MouseEvent) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function ComicReader({
  comic,
  currentPage,
  currentPanel,
  panels,
  totalPages: _totalPages,
  totalPanels,
  fitMode,
  mangaMode,
  rotation,
  showDoublePage,
  editMode,
  blackBorders,
  showInfo,
  slideshowActive,
  onPanelClick,
}: ComicReaderProps) {
  const [detecting, setDetecting] = useState(false);
  const [detectedCount, setDetectedCount] = useState(0);
  const page = comic[currentPage];
  const panel = panels[currentPanel];

  // Panel detection animation
  useEffect(() => {
    setDetecting(true);
    setDetectedCount(0);
    const totalToDetect = panels.length;
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setDetectedCount(count);
      if (count >= totalToDetect) {
        clearInterval(interval);
        setTimeout(() => setDetecting(false), 300);
      }
    }, 150);
    return () => clearInterval(interval);
  }, [currentPage, panels.length]);

  const getFitStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      transform: `rotate(${rotation}deg)`,
      transition: 'transform 0.3s ease',
    };

    if (panel && !showDoublePage) {
      // Panel zoom mode
      const scale = 1 / Math.min(panel.width, panel.height);
      const translateX = -(panel.x + panel.width / 2) * 100 * scale + 50;
      const translateY = -(panel.y + panel.height / 2) * 100 * scale + 50;

      return {
        ...baseStyle,
        transform: `${baseStyle.transform} scale(${scale * 0.95}) translate(${translateX}%, ${translateY}%)`,
      };
    }

    switch (fitMode) {
      case 'width':
        return { ...baseStyle, width: '100%', height: 'auto' };
      case 'height':
        return { ...baseStyle, width: 'auto', height: '100%' };
      case 'original':
        return { ...baseStyle, width: 'auto', height: 'auto' };
      default:
        return { ...baseStyle, maxWidth: '100%', maxHeight: '100%' };
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className={`absolute inset-0 ${blackBorders ? 'bg-black' : 'bg-gray-950'}`} />

      {/* Comic Page(s) */}
      <div
        className={`relative ${showDoublePage ? 'flex gap-1' : ''} h-full items-center justify-center`}
        onClick={onPanelClick}
        style={{ cursor: editMode ? 'crosshair' : 'default' }}
      >
        {showDoublePage && currentPage > 0 ? (
          <>
            {/* Previous page */}
            <img
              src={comic[currentPage - 1].image}
              alt={`Page ${currentPage}`}
              className="max-h-full object-contain"
              style={{ transform: `rotate(${rotation}deg)` }}
              draggable={false}
            />
            {/* Current page */}
            <img
              src={page.image}
              alt={`Page ${currentPage + 1}`}
              className="max-h-full object-contain"
              style={getFitStyle()}
              draggable={false}
            />
          </>
        ) : (
          <img
            src={page.image}
            alt={`Page ${currentPage + 1}`}
            className="max-h-full object-contain"
            style={getFitStyle()}
            draggable={false}
          />
        )}

        {/* Panel overlay in edit mode */}
        {editMode && (
          <div className="absolute inset-0">
            {panels.map((p, i) => (
              <div
                key={i}
                className={`absolute border-2 ${i === currentPanel ? 'border-blue-400' : 'border-green-400'} border-dashed rounded`}
                style={{
                  left: `${p.x * 100}%`,
                  top: `${p.y * 100}%`,
                  width: `${p.width * 100}%`,
                  height: `${p.height * 100}%`,
                }}
              >
                <span className="absolute top-0 left-0 bg-black/70 text-white text-xs px-1 rounded-br">
                  {i + 1}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Panel highlight */}
        {panel && !editMode && totalPanels > 1 && (
          <div
            className="absolute border-2 border-blue-400/50 rounded pointer-events-none transition-all duration-300"
            style={{
              left: `${panel.x * 100}%`,
              top: `${panel.y * 100}%`,
              width: `${panel.width * 100}%`,
              height: `${panel.height * 100}%`,
            }}
          />
        )}
      </div>

      {/* Reading direction indicator */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs text-white/30 z-10">
        {mangaMode ? '← Right to Left (Manga)' : 'Left to Right →'}
      </div>

      {/* Info bar */}
      {showInfo && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/80 px-4 py-2 rounded-lg text-sm z-40">
          <div className="flex items-center gap-4">
            <span><i className="fas fa-book-open mr-1"></i> {page.title}</span>
            <span><i className="fas fa-th-large mr-1"></i> {totalPanels} panels</span>
            <span><i className="fas fa-expand mr-1"></i> {fitMode}</span>
            {slideshowActive && <span className="text-blue-400"><i className="fas fa-play mr-1"></i> Slideshow</span>}
          </div>
        </div>
      )}

      {/* Panel detection progress */}
      {detecting && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-40 animate-fade-in">
          <div className="bg-black/80 px-4 py-2 rounded-lg flex items-center gap-3">
            <div className="w-4 h-4 border-2 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs text-orange-300">
              Detecting panels... {detectedCount}/{panels.length}
            </span>
            <div className="w-20 h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-400 transition-all duration-150"
                style={{ width: `${(detectedCount / panels.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Guided mode indicator */}
      {panel && totalPanels > 1 && !detecting && (
        <div className="absolute top-8 right-2 bg-black/60 px-2 py-1 rounded text-xs z-40">
          Panel {currentPanel + 1}/{totalPanels}
        </div>
      )}
    </div>
  );
}
