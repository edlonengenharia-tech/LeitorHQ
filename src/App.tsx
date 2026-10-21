import { useState, useEffect, useCallback, useRef } from 'react';
import ComicReader from './components/ComicReader';
import ThumbnailBrowser from './components/ThumbnailBrowser';
import Settings from './components/Settings';
import HelpOverlay from './components/HelpOverlay';
import WelcomeScreen from './components/WelcomeScreen';
import ViewingHistory, { HistoryEntry } from './components/ViewingHistory';
import { ComicPage, Panel, ReadingMode, FitMode, AppSettings } from './types';
import { sampleComic, generatePanels } from './data/sampleComic';
import { useElectron } from './hooks/useElectron';

function App() {
  const { isElectron, onComicLoaded, onNavigate, onShowHelp } = useElectron();
  const [showWelcome, setShowWelcome] = useState(true);
  const [comic, setComic] = useState<ComicPage[]>(sampleComic);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentPanel, setCurrentPanel] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showBrowser, setShowBrowser] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showSlider, setShowSlider] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [viewingHistory, setViewingHistory] = useState<HistoryEntry[]>([]);
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [slideshowActive, setSlideshowActive] = useState(false);
  const [slideshowInterval, setSlideshowInterval] = useState(3000);
  const [readingMode, setReadingMode] = useState<ReadingMode>('standard');
  const [fitMode, setFitMode] = useState<FitMode>('screen');
  const [mangaMode, setMangaMode] = useState(false);
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierSize, setMagnifierSize] = useState(150);
  const [magnifierZoom, setMagnifierZoom] = useState(2);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [editMode, setEditMode] = useState(false);
  const [showDoublePage, setShowDoublePage] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [settings, setSettings] = useState<AppSettings>({
    language: 'en',
    theme: 'dark',
    fontSize: 14,
    autoDetectPanels: true,
    guidedMode: false,
    showWholePageFirst: false,
    blackBorders: false,
    slideshowTime: 3,
    escBehavior: 'leave-fullscreen',
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const slideshowRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const panels = generatePanels(comic[currentPage].id);
  const totalPages = comic.length;
  const totalPanels = panels.length;

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (showSettings || showBrowser) return;

    switch (e.key) {
      case 'ArrowRight':
      case ' ':
        e.preventDefault();
        goNext();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        goPrev();
        break;
      case 'f':
      case 'F':
        toggleFullscreen();
        break;
      case 't':
      case 'T':
        setShowBrowser(prev => !prev);
        break;
      case 'h':
      case 'H':
        if (e.ctrlKey) {
          e.preventDefault();
          setSlideshowActive(prev => !prev);
        } else {
          setShowHelp(prev => !prev);
        }
        break;
      case 'i':
      case 'I':
        if (e.ctrlKey) {
          setShowSlider(prev => !prev);
        } else {
          setShowInfo(prev => !prev);
        }
        break;
      case 'r':
      case 'R':
        setMangaMode(prev => !prev);
        break;
      case 'm':
      case 'M':
        setShowMagnifier(prev => !prev);
        break;
      case 'g':
      case 'G':
        setSettings(prev => ({ ...prev, guidedMode: !prev.guidedMode }));
        break;
      case 'v':
      case 'V':
        setSettings(prev => ({ ...prev, showWholePageFirst: !prev.showWholePageFirst }));
        break;
      case 'd':
      case 'D':
        if (e.shiftKey) {
          setShowDoublePage(prev => !prev);
        } else {
          setSettings(prev => ({ ...prev, blackBorders: !prev.blackBorders }));
        }
        break;
      case 'e':
      case 'E':
        setEditMode(prev => !prev);
        break;
      case 'Escape':
        if (showHelp) setShowHelp(false);
        else if (isFullscreen) toggleFullscreen();
        break;
      case '[':
        setRotation(prev => (prev - 90) % 360);
        break;
      case ']':
        setRotation(prev => (prev + 90) % 360);
        break;
      case '1':
        setFitMode('screen');
        break;
      case '2':
        setFitMode('width');
        break;
      case '3':
        setFitMode('height');
        break;
      case '4':
        setFitMode('original');
        break;
      case 'l':
      case 'L':
        if (e.ctrlKey) {
          e.preventDefault();
          setShowHistory(prev => !prev);
        } else {
          setShowBrowser(prev => !prev);
        }
        break;
      case 'n':
      case 'N':
        // Next file (simulated)
        break;
      case 'b':
      case 'B':
        if (e.ctrlKey) {
          e.preventDefault();
          // Toggle bookmark
          setBookmarks(prev =>
            prev.includes(currentPage)
              ? prev.filter(p => p !== currentPage)
              : [...prev, currentPage]
          );
        } else {
          // Previous file (simulated)
        }
        break;
    }
  }, [currentPage, currentPanel, isFullscreen, showHelp, showSettings, showBrowser]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Slideshow
  useEffect(() => {
    if (slideshowActive) {
      slideshowRef.current = setInterval(() => {
        goNext();
      }, slideshowInterval);
    } else {
      if (slideshowRef.current) {
        clearInterval(slideshowRef.current);
      }
    }
    return () => {
      if (slideshowRef.current) {
        clearInterval(slideshowRef.current);
      }
    };
  }, [slideshowActive, slideshowInterval]);

  // Mouse tracking for magnifier
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Track viewing history
  useEffect(() => {
    setViewingHistory(prev => {
      const entry: HistoryEntry = {
        pageId: comic[currentPage].id,
        pageIndex: currentPage,
        panelIndex: currentPanel,
        timestamp: new Date(),
        title: comic[currentPage].title,
      };
      // Keep last 20 entries, avoid duplicates
      const filtered = prev.filter(e => !(e.pageIndex === currentPage && e.panelIndex === currentPanel));
      return [entry, ...filtered].slice(0, 20);
    });
  }, [currentPage, currentPanel, comic]);

  // Electron integration
  useEffect(() => {
    if (isElectron) {
      // Listen for comic loaded from Electron
      onComicLoaded((data: any) => {
        if (data && data.pages) {
          setComic(data.pages);
          setCurrentPage(0);
          setCurrentPanel(0);
          setShowWelcome(false);
        }
      });

      // Listen for navigation commands from Electron menu
      onNavigate((direction: string) => {
        switch (direction) {
          case 'next':
            goNext();
            break;
          case 'prev':
            goPrev();
            break;
          case 'nextPage':
            if (currentPage < comic.length - 1) {
              setCurrentPage(prev => prev + 1);
              setCurrentPanel(0);
            }
            break;
          case 'prevPage':
            if (currentPage > 0) {
              setCurrentPage(prev => prev - 1);
              setCurrentPanel(0);
            }
            break;
        }
      });

      // Listen for help command from Electron menu
      onShowHelp(() => {
        setShowHelp(true);
      });
    }
  }, [isElectron, onComicLoaded, onNavigate, onShowHelp]);

  const goNext = () => {
    if (currentPanel < totalPanels - 1) {
      setCurrentPanel(prev => prev + 1);
    } else if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
      setCurrentPanel(0);
    }
  };

  const goPrev = () => {
    if (currentPanel > 0) {
      setCurrentPanel(prev => prev - 1);
    } else if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
      setCurrentPanel(generatePanels(comic[currentPage - 1].id).length - 1);
    }
  };

  const goToPage = (pageIndex: number) => {
    setCurrentPage(pageIndex);
    setCurrentPanel(0);
    setShowBrowser(false);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (showMagnifier) {
      if (e.shiftKey) {
        setMagnifierSize(prev => Math.max(50, Math.min(400, prev + (e.deltaY > 0 ? -10 : 10))));
      } else if (e.ctrlKey) {
        setMagnifierZoom(prev => Math.max(1.5, Math.min(5, prev + (e.deltaY > 0 ? -0.25 : 0.25))));
      }
    } else {
      if (e.deltaY > 0) goNext();
      else goPrev();
    }
  };

  const handlePanelClick = (e: React.MouseEvent) => {
    if (editMode) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    // Check if clicked on a panel
    for (let i = 0; i < panels.length; i++) {
      const panel = panels[i];
      if (x >= panel.x && x <= panel.x + panel.width &&
          y >= panel.y && y <= panel.y + panel.height) {
        setCurrentPanel(i);
        return;
      }
    }
  };

  const { openFileDialog, openFolderDialog } = useElectron();

  if (showWelcome) {
    return (
      <WelcomeScreen
        onStart={() => setShowWelcome(false)}
        onOpenFile={openFileDialog}
        onOpenFolder={openFolderDialog}
        isElectron={isElectron}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-screen w-screen bg-gray-950 text-white overflow-hidden relative select-none"
      onWheel={handleWheel}
      onContextMenu={(e) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY });
      }}
      onClick={() => setContextMenu(null)}
    >
      {/* Main Reader */}
      <ComicReader
        comic={comic}
        currentPage={currentPage}
        currentPanel={currentPanel}
        panels={panels}
        totalPages={totalPages}
        totalPanels={totalPanels}
        fitMode={fitMode}
        mangaMode={mangaMode}
        rotation={rotation}
        showDoublePage={showDoublePage}
        editMode={editMode}
        blackBorders={settings.blackBorders}
        showInfo={showInfo}
        slideshowActive={slideshowActive}
        onPanelClick={handlePanelClick}
        onNext={goNext}
        onPrev={goPrev}
      />

      {/* Magnifier */}
      {showMagnifier && (
        <div
          className="fixed pointer-events-none z-50 rounded-full border-2 border-white/50 overflow-hidden shadow-2xl"
          style={{
            width: magnifierSize,
            height: magnifierSize,
            left: mousePos.x - magnifierSize / 2,
            top: mousePos.y - magnifierSize / 2,
          }}
        >
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url(${comic[currentPage].image})`,
              backgroundSize: `${magnifierSize * magnifierZoom}px`,
              backgroundPosition: `${-mousePos.x * magnifierZoom + magnifierSize / 2}px ${-mousePos.y * magnifierZoom + magnifierSize / 2}px`,
              backgroundRepeat: 'no-repeat',
            }}
          />
        </div>
      )}

      {/* Top Menu Bar */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-2 flex items-center gap-2 z-40 opacity-0 hover:opacity-100 transition-opacity duration-300">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowBrowser(true)}
            className="px-3 py-1.5 text-sm bg-white/10 hover:bg-white/20 rounded transition-colors"
            title="Browse (T)"
          >
            <i className="fas fa-th-large mr-1"></i> Browse
          </button>
          <button
            onClick={toggleFullscreen}
            className="px-3 py-1.5 text-sm bg-white/10 hover:bg-white/20 rounded transition-colors"
            title="Fullscreen (F)"
          >
            <i className="fas fa-expand mr-1"></i> {isFullscreen ? 'Exit' : 'Fullscreen'}
          </button>
          <button
            onClick={() => setSlideshowActive(prev => !prev)}
            className={`px-3 py-1.5 text-sm rounded transition-colors ${slideshowActive ? 'bg-blue-600 hover:bg-blue-700' : 'bg-white/10 hover:bg-white/20'}`}
            title="Slideshow (Ctrl+H)"
          >
            <i className={`fas ${slideshowActive ? 'fa-pause' : 'fa-play'} mr-1`}></i> Slideshow
          </button>
          <button
            onClick={() => setShowMagnifier(prev => !prev)}
            className={`px-3 py-1.5 text-sm rounded transition-colors ${showMagnifier ? 'bg-blue-600 hover:bg-blue-700' : 'bg-white/10 hover:bg-white/20'}`}
            title="Magnifier (M)"
          >
            <i className="fas fa-search-plus mr-1"></i> Magnifier
          </button>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-1">
          <button
            onClick={() => setReadingMode(mangaMode ? 'standard' : 'manga')}
            className={`px-3 py-1.5 text-sm rounded transition-colors ${mangaMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-white/10 hover:bg-white/20'}`}
            title="Manga Mode (R)"
          >
            <i className="fas fa-book-open mr-1"></i> {mangaMode ? 'Manga' : 'Standard'}
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="px-3 py-1.5 text-sm bg-white/10 hover:bg-white/20 rounded transition-colors"
            title="Settings"
          >
            <i className="fas fa-cog mr-1"></i> Settings
          </button>
          <button
            onClick={() => setShowHelp(true)}
            className="px-3 py-1.5 text-sm bg-white/10 hover:bg-white/20 rounded transition-colors"
            title="Help (H)"
          >
            <i className="fas fa-question-circle mr-1"></i> Help
          </button>
        </div>
      </div>

      {/* Fit Mode Buttons */}
      <div className="absolute bottom-12 left-2 flex flex-col gap-1 z-40 opacity-0 hover:opacity-100 transition-opacity duration-300">
        {[
          { mode: 'screen' as FitMode, label: 'Screen', key: '1', icon: 'fa-arrows-alt' },
          { mode: 'width' as FitMode, label: 'Width', key: '2', icon: 'fa-arrows-alt-h' },
          { mode: 'height' as FitMode, label: 'Height', key: '3', icon: 'fa-arrows-alt-v' },
          { mode: 'original' as FitMode, label: '100%', key: '4', icon: 'fa-search' },
        ].map(item => (
          <button
            key={item.mode}
            onClick={() => setFitMode(item.mode)}
            className={`px-2 py-1 text-xs rounded transition-colors ${fitMode === item.mode ? 'bg-blue-600' : 'bg-white/10 hover:bg-white/20'}`}
            title={`${item.label} (${item.key})`}
          >
            <i className={`fas ${item.icon} mr-1`}></i> {item.label}
          </button>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goPrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-24 bg-black/30 hover:bg-black/60 flex items-center justify-center z-30 transition-colors opacity-0 hover:opacity-100"
        title="Previous"
      >
        <i className="fas fa-chevron-left text-xl"></i>
      </button>
      <button
        onClick={goNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-24 bg-black/30 hover:bg-black/60 flex items-center justify-center z-30 transition-colors opacity-0 hover:opacity-100"
        title="Next"
      >
        <i className="fas fa-chevron-right text-xl"></i>
      </button>

      {/* Page Counter */}
      <div className="absolute bottom-2 right-2 bg-black/70 px-3 py-1 rounded text-sm z-40">
        p. {currentPage + 1}/{totalPages}
        {totalPanels > 0 && ` · panel ${currentPanel + 1}/${totalPanels}`}
        {slideshowActive && <span className="ml-2 text-blue-400">▶ Slideshow</span>}
      </div>

      {/* Page Slider */}
      {showSlider && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-80 bg-black/80 px-4 py-3 rounded-lg z-40">
          <div className="flex items-center gap-3">
            <button
              onClick={goPrev}
              className="text-white/60 hover:text-white transition-colors"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <input
              type="range"
              min="0"
              max={totalPages - 1}
              value={currentPage}
              onChange={(e) => goToPage(Number(e.target.value))}
              className="flex-1"
            />
            <button
              onClick={goNext}
              className="text-white/60 hover:text-white transition-colors"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
            <span className="text-xs text-white/60 w-16 text-right">
              {currentPage + 1} / {totalPages}
            </span>
          </div>
        </div>
      )}

      {/* Edit Mode Indicator */}
      {editMode && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-yellow-600/90 px-4 py-2 rounded-lg text-sm z-40">
          <i className="fas fa-edit mr-2"></i> Edit Mode (E to exit)
          <span className="ml-2 text-yellow-200">Drag to create panels, right-click to delete</span>
        </div>
      )}

      {/* Thumbnail Browser */}
      {showBrowser && (
        <ThumbnailBrowser
          comic={comic}
          currentPage={currentPage}
          onSelectPage={goToPage}
          onClose={() => setShowBrowser(false)}
        />
      )}

      {/* Settings */}
      {showSettings && (
        <Settings
          settings={settings}
          onSettingsChange={setSettings}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Help Overlay */}
      {showHelp && (
        <HelpOverlay onClose={() => setShowHelp(false)} />
      )}

      {/* Viewing History */}
      {showHistory && (
        <ViewingHistory
          history={viewingHistory}
          comic={comic}
          onSelect={(pageIndex, panelIndex) => {
            setCurrentPage(pageIndex);
            setCurrentPanel(panelIndex);
          }}
          onClose={() => setShowHistory(false)}
        />
      )}

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="fixed bg-gray-900 border border-white/10 rounded-lg shadow-2xl py-1 z-50 min-w-48"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onMouseLeave={() => setContextMenu(null)}
        >
          <button
            onClick={() => { toggleFullscreen(); setContextMenu(null); }}
            className="w-full px-4 py-2 text-left text-sm hover:bg-white/10 transition-colors flex items-center gap-2"
          >
            <i className="fas fa-expand w-4"></i> {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'} (F)
          </button>
          <button
            onClick={() => { setShowBrowser(true); setContextMenu(null); }}
            className="w-full px-4 py-2 text-left text-sm hover:bg-white/10 transition-colors flex items-center gap-2"
          >
            <i className="fas fa-th-large w-4"></i> Browse Pages (T)
          </button>
          <button
            onClick={() => {
              setBookmarks(prev =>
                prev.includes(currentPage)
                  ? prev.filter(p => p !== currentPage)
                  : [...prev, currentPage]
              );
              setContextMenu(null);
            }}
            className="w-full px-4 py-2 text-left text-sm hover:bg-white/10 transition-colors flex items-center gap-2"
          >
            <i className={`fas ${bookmarks.includes(currentPage) ? 'fa-bookmark text-yellow-400' : 'fa-bookmark'} w-4`}></i>
            {bookmarks.includes(currentPage) ? 'Remove Bookmark' : 'Add Bookmark'} (Ctrl+B)
          </button>
          <div className="border-t border-white/10 my-1"></div>
          <button
            onClick={() => { setShowInfo(prev => !prev); setContextMenu(null); }}
            className="w-full px-4 py-2 text-left text-sm hover:bg-white/10 transition-colors flex items-center gap-2"
          >
            <i className="fas fa-info-circle w-4"></i> Toggle Info (I)
          </button>
          <button
            onClick={() => { setShowSlider(prev => !prev); setContextMenu(null); }}
            className="w-full px-4 py-2 text-left text-sm hover:bg-white/10 transition-colors flex items-center gap-2"
          >
            <i className="fas fa-sliders-h w-4"></i> Page Slider (Ctrl+I)
          </button>
          <div className="border-t border-white/10 my-1"></div>
          <button
            onClick={() => { setShowSettings(true); setContextMenu(null); }}
            className="w-full px-4 py-2 text-left text-sm hover:bg-white/10 transition-colors flex items-center gap-2"
          >
            <i className="fas fa-cog w-4"></i> Settings
          </button>
          <button
            onClick={() => { setShowHelp(true); setContextMenu(null); }}
            className="w-full px-4 py-2 text-left text-sm hover:bg-white/10 transition-colors flex items-center gap-2"
          >
            <i className="fas fa-question-circle w-4"></i> Keyboard Shortcuts (H)
          </button>
        </div>
      )}

      {/* Bookmark indicator */}
      {bookmarks.includes(currentPage) && (
        <div className="absolute top-2 right-2 z-40">
          <i className="fas fa-bookmark text-yellow-400 text-sm"></i>
        </div>
      )}
    </div>
  );
}

export default App;
