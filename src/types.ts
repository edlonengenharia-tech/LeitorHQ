export interface ComicPage {
  id: string;
  image: string;
  title?: string;
}

export interface Panel {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type ReadingMode = 'standard' | 'manga' | 'webtoon';
export type FitMode = 'screen' | 'width' | 'height' | 'original';

export interface AppSettings {
  language: string;
  theme: string;
  fontSize: number;
  autoDetectPanels: boolean;
  guidedMode: boolean;
  showWholePageFirst: boolean;
  blackBorders: boolean;
  slideshowTime: number;
  escBehavior: 'leave-fullscreen' | 'ask' | 'exit';
}
