import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, VolumeX, Volume2, Play, Pause } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videos: Array<{
    id: number;
    thumbnail: string;
  }>;
  initialVideoIndex: number;
}

const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose, videos, initialVideoIndex }) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(initialVideoIndex);
  const [isMuted, setIsMuted] = useState(true); // Iniciar siempre muted para iOS
  const [showControls, setShowControls] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [canPlay, setCanPlay] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Detectar iOS
  const isIOS = () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  };

  // Detectar si es Safari
  const isSafari = () => {
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  };

  useEffect(() => {
    setCurrentVideoIndex(initialVideoIndex);
    // Resetear estados cuando cambia el video y mostrar controles
    setIsLoading(true);
    setIsPlaying(false);
    setShowControls(true);
    setCanPlay(false);
  }, [initialVideoIndex]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Auto-hide controls after 4 seconds, pero no si el video está pausado en móvil
  useEffect(() => {
    if (showControls) {
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
      
      // En móvil, no ocultar controles automáticamente si el video está pausado
      const isMobile = isIOS() || /Android/i.test(navigator.userAgent);
      if (isMobile && !isPlaying) {
        return; // No iniciar timer si estamos en móvil y el video está pausado
      }
      
      const timeout = setTimeout(() => {
        setShowControls(false);
      }, 4000);
      
      setControlsTimeout(timeout);
    }
    
    return () => {
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
    };
  }, [showControls, isPlaying]);

  // Show/hide controls when clicking on video
  const handleVideoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Marcar que el usuario ha interactuado
    setHasUserInteracted(true);
    
    if (showControls) {
      // Si los controles están visibles, los ocultamos
      setShowControls(false);
    } else {
      // Si los controles están ocultos, los mostramos
      setShowControls(true);
    }
  };

  const nextVideo = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
    setShowControls(true);
    setIsLoading(true);
    setIsPlaying(false);
    setCanPlay(false);
  };

  const prevVideo = () => {
    setCurrentVideoIndex((prev) => (prev - 1 + videos.length) % videos.length);
    setShowControls(true);
    setIsLoading(true);
    setIsPlaying(false);
    setCanPlay(false);
  };

  const togglePlay = async () => {
    if (!videoRef.current || !canPlay) return;
    
    setHasUserInteracted(true);
    
    try {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        // Para iOS, asegurarse de que el video esté listo
        if (videoRef.current.readyState >= 2) {
          await videoRef.current.play();
          setIsPlaying(true);
        }
      }
      setShowControls(true);
    } catch (error) {
      console.log('Error al controlar reproducción:', error);
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      setIsMuted(!isMuted);
      videoRef.current.muted = !isMuted;
      setShowControls(true);
    }
  };

  // Eventos del video
  const handleVideoLoadStart = () => {
    setIsLoading(true);
    setIsPlaying(false);
    setCanPlay(false);
  };

  const handleVideoLoadedData = () => {
    console.log('Video data loaded');
    setIsLoading(false);
  };

  const handleVideoCanPlay = () => {
    console.log('Video can play');
    setIsLoading(false);
    setCanPlay(true);
    
    // En iOS, mostrar controles cuando esté listo
    if (isIOS()) {
      setShowControls(true);
    }
  };

  const handleVideoCanPlayThrough = () => {
    console.log('Video can play through');
    setCanPlay(true);
  };

  const handleVideoPlay = () => {
    setIsPlaying(true);
  };

  const handleVideoPause = () => {
    setIsPlaying(false);
  };

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error('Error cargando video:', e);
    setIsLoading(false);
    setCanPlay(false);
  };

  const handleVideoWaiting = () => {
    setIsLoading(true);
  };

  const handleVideoPlaying = () => {
    setIsLoading(false);
  };

  if (!isOpen) return null;

  const currentVideo = videos[currentVideoIndex];

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center p-4">
      <div className="relative w-full max-w-sm mx-auto">
        {/* Close button - mejor posicionamiento */}
        <button
          onClick={onClose}
          className={`absolute top-2 right-2 text-white hover:text-yellow-400 transition-all duration-300 z-30 bg-black/70 rounded-full p-2 backdrop-blur-sm ${
            showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <X className="w-6 h-6" />
        </button>

        {/* Video container */}
        <div 
          className="relative bg-black overflow-hidden rounded-lg" 
          style={{ aspectRatio: '9/16' }}
          onClick={handleVideoClick}
        >
          <video
            ref={videoRef}
            key={currentVideo.id} // Forzar re-render cuando cambia el video
            className="w-full h-full object-contain"
            muted={isMuted}
            playsInline
            webkit-playsinline="true"
            controls={false}
            preload="auto"
            crossOrigin="anonymous"
            onLoadStart={handleVideoLoadStart}
            onLoadedData={handleVideoLoadedData}
            onCanPlay={handleVideoCanPlay}
            onCanPlayThrough={handleVideoCanPlayThrough}
            onPlay={handleVideoPlay}
            onPause={handleVideoPause}
            onError={handleVideoError}
            onWaiting={handleVideoWaiting}
            onPlaying={handleVideoPlaying}
          >
            <source src={currentVideo.thumbnail} type="video/mp4" />
            <source src={currentVideo.thumbnail} type="video/webm" />
            Tu navegador no soporta el elemento video.
          </video>

          {/* Loading spinner */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
              <div className="w-12 h-12 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
            </div>
          )}

          {/* Play button overlay - visible cuando está pausado */}
          {canPlay && !isLoading && !isPlaying && (
            <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
              showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
                className="bg-black/50 text-white p-6 rounded-full hover:bg-black/70 transition-all duration-300 backdrop-blur-sm border-2 border-white/20"
              >
                <Play className="w-8 h-8 ml-1" />
              </button>
            </div>
          )}

          {/* Navigation arrows */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevVideo();
            }}
            className={`absolute left-4 top-1/2 -translate-y-1/2 bg-black/70 text-white p-3 rounded-full hover:bg-black/90 transition-all duration-300 z-10 backdrop-blur-sm ${
              showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              nextVideo();
            }}
            className={`absolute right-4 top-1/2 -translate-y-1/2 bg-black/70 text-white p-3 rounded-full hover:bg-black/90 transition-all duration-300 z-10 backdrop-blur-sm ${
              showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Bottom controls */}
          <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 z-10 transition-all duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}>
            {/* Play/Pause button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              className="bg-black/70 text-white p-3 rounded-full hover:bg-black/90 transition-colors backdrop-blur-sm"
              disabled={!canPlay || isLoading}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>
            
            {/* Mute button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleMute();
              }}
              className="bg-black/70 text-white p-3 rounded-full hover:bg-black/90 transition-colors backdrop-blur-sm"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>

          {/* Mensaje para iOS si hay problemas */}
          {isIOS() && !canPlay && !isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-center p-4">
              <div>
                <p className="text-sm mb-2">Toca para cargar el video</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (videoRef.current) {
                      videoRef.current.load();
                    }
                  }}
                  className="bg-white/20 px-4 py-2 rounded-full text-sm"
                >
                  Cargar video
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoModal;