import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Play, Pause, VolumeX, Volume2, AlertCircle } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videos: Array<{
    id: number;
    thumbnail: string;
    videoUrl: string;
  }>;
  initialVideoIndex: number;
}

const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose, videos, initialVideoIndex }) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(initialVideoIndex);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [hasError, setHasError] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [loadTimeout, setLoadTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [debugInfo, setDebugInfo] = useState('');
  
  const videoRef = useRef<HTMLVideoElement>(null);

  // Detectar dispositivos móviles y iOS específicamente
  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  const isIOS = () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
           (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  };

  // Limpiar timeouts
  const clearAllTimeouts = useCallback(() => {
    if (controlsTimeout) {
      clearTimeout(controlsTimeout);
      setControlsTimeout(null);
    }
    if (loadTimeout) {
      clearTimeout(loadTimeout);
      setLoadTimeout(null);
    }
  }, [controlsTimeout, loadTimeout]);

  useEffect(() => {
    setCurrentVideoIndex(initialVideoIndex);
  }, [initialVideoIndex]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setShowControls(true);
      setHasUserInteracted(false);
    } else {
      document.body.style.overflow = 'unset';
      clearAllTimeouts();
    }

    return () => {
      document.body.style.overflow = 'unset';
      clearAllTimeouts();
    };
  }, [isOpen, clearAllTimeouts]);

  // Timeout para loading infinito - CRÍTICO para iOS
  useEffect(() => {
    if (isLoading) {
      const timeout = setTimeout(() => {
        if (isLoading) {
          setIsLoading(false);
          setHasError(true);
          setDebugInfo('Video loading timeout - possible network or codec issue');
        }
      }, 15000); // 15 segundos timeout
      
      setLoadTimeout(timeout);
    } else {
      if (loadTimeout) {
        clearTimeout(loadTimeout);
        setLoadTimeout(null);
      }
    }
  }, [isLoading, loadTimeout]);

  // Auto-hide controls
  useEffect(() => {
    if (showControls && isOpen && isPlaying) {
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
      
      const timeout = setTimeout(() => {
        setShowControls(false);
      }, 4000);
      
      setControlsTimeout(timeout);
    }
  }, [showControls, isOpen, isPlaying]);

  // Reset estados cuando cambia el video
  useEffect(() => {
    setIsLoading(true);
    setIsPlaying(false);
    setHasError(false);
    setHasUserInteracted(false);
    setDebugInfo('');
    clearAllTimeouts();
  }, [currentVideoIndex, clearAllTimeouts]);

  // Manejo de eventos del video con debug info
  const handleLoadStart = () => {
    setIsLoading(true);
    setHasError(false);
    setDebugInfo('Starting video load...');
  };

  const handleLoadedMetadata = () => {
    setDebugInfo('Metadata loaded successfully');
    
    // Para iOS, esto es suficiente para mostrar el primer frame
    if (isIOS()) {
      setIsLoading(false);
    }
  };

  const handleCanPlay = async () => {
    setIsLoading(false);
    setHasError(false);
    setDebugInfo('Video ready to play');
    
    // Solo autoplay en desktop
    if (!isMobile() && isOpen && videoRef.current) {
      try {
        await videoRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        setDebugInfo('Autoplay prevented: ' + error);
        setIsPlaying(false);
      }
    }
  };

  const handleError = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    const error = video.error;
    
    setIsLoading(false);
    setHasError(true);
    
    let errorMsg = 'Unknown video error';
    if (error) {
      switch (error.code) {
        case error.MEDIA_ERR_ABORTED:
          errorMsg = 'Video loading aborted';
          break;
        case error.MEDIA_ERR_NETWORK:
          errorMsg = 'Network error loading video';
          break;
        case error.MEDIA_ERR_DECODE:
          errorMsg = 'Video decode error - codec issue';
          break;
        case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
          errorMsg = 'Video format not supported';
          break;
      }
    }
    
    setDebugInfo(errorMsg);
    console.error('Video error:', errorMsg, error);
  };

  const handlePlay = () => {
    setIsPlaying(true);
    setDebugInfo('Video playing');
  };

  const handlePause = () => {
    setIsPlaying(false);
    setDebugInfo('Video paused');
  };

  const handleWaiting = () => {
    setIsLoading(true);
    setDebugInfo('Video buffering...');
  };

  const handlePlaying = () => {
    setIsLoading(false);
    setDebugInfo('Video playing smoothly');
  };

  const handleVideoClick = () => {
    if (!hasUserInteracted) {
      setHasUserInteracted(true);
    }
    
    if (isPlaying) {
      setShowControls(!showControls);
    } else {
      togglePlayPause();
    }
  };

  const nextVideo = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
    setShowControls(true);
  };

  const prevVideo = () => {
    setCurrentVideoIndex((prev) => (prev - 1 + videos.length) % videos.length);
    setShowControls(true);
  };

  const togglePlayPause = async () => {
    if (!videoRef.current || hasError) return;
    
    setHasUserInteracted(true);
    
    try {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        // Verificar si el video está listo
        if (videoRef.current.readyState >= 2) {
          await videoRef.current.play();
        } else {
          // Forzar carga si no está listo
          videoRef.current.load();
          
          // Esperar a que esté listo
          const playWhenReady = () => {
            if (videoRef.current && videoRef.current.readyState >= 2) {
              videoRef.current.play().catch((error) => {
                setDebugInfo('Play failed: ' + error.message);
                setHasError(true);
              });
            }
          };
          
          videoRef.current.addEventListener('canplay', playWhenReady, { once: true });
          
          // Timeout de seguridad
          setTimeout(() => {
            if (videoRef.current) {
              videoRef.current.removeEventListener('canplay', playWhenReady);
            }
          }, 5000);
        }
      }
    } catch (error: any) {
      setDebugInfo('Play error: ' + error.message);
      setHasError(true);
    }
    
    setShowControls(true);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    setShowControls(true);
  };

  const forceReload = () => {
    if (videoRef.current) {
      setIsLoading(true);
      setHasError(false);
      setDebugInfo('Force reloading video...');
      videoRef.current.load();
    }
  };

  if (!isOpen) return null;

  const currentVideo = videos[currentVideoIndex];

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <div className="relative w-full max-w-sm mx-auto h-full flex items-center justify-center p-4">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className={`absolute top-8 right-8 text-white hover:text-red-400 transition-all duration-300 z-30 bg-black/70 rounded-full p-3 backdrop-blur-sm ${
            showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <X className="w-6 h-6" />
        </button>

        {/* Debug info (solo en desarrollo) */}
        {process.env.NODE_ENV === 'development' && debugInfo && (
          <div className="absolute top-20 left-4 right-4 bg-black/80 text-white p-2 rounded text-xs z-30">
            {debugInfo}
          </div>
        )}

        {/* Video container */}
        <div 
          className="relative bg-black overflow-hidden rounded-lg w-full" 
          style={{ aspectRatio: '9/16', maxHeight: '80vh' }}
          onClick={handleVideoClick}
        >
          {hasError ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <div className="text-center text-white p-4">
                <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <p className="mb-4 text-sm">{debugInfo || 'Error al cargar el video'}</p>
                <div className="space-y-2">
                  <button 
                    onClick={forceReload}
                    className="bg-yellow-400 text-black px-4 py-2 rounded text-sm mr-2"
                  >
                    Reintentar
                  </button>
                  <button 
                    onClick={() => window.open(currentVideo.videoUrl, '_blank')}
                    className="bg-blue-500 text-white px-4 py-2 rounded text-sm"
                  >
                    Abrir en nueva pestaña
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                className="w-full h-full object-contain"
                // ORDEN CRÍTICO PARA iOS
                muted={isMuted}
                playsInline
                webkit-playsinline="true"
                x5-playsinline="true"
                x5-video-player-type="h5"
                x5-video-player-fullscreen="true"
                // Configuración específica para iOS
                preload={isMobile() ? "metadata" : "auto"}
                controlsList="nodownload nofullscreen noremoteplaybar"
                disablePictureInPicture
                disableRemotePlayback
                // Poster siempre visible
                poster={currentVideo.thumbnail}
                // Event handlers completos
                onLoadStart={handleLoadStart}
                onLoadedMetadata={handleLoadedMetadata}
                onCanPlay={handleCanPlay}
                onError={handleError}
                onPlay={handlePlay}
                onPause={handlePause}
                onWaiting={handleWaiting}
                onPlaying={handlePlaying}
                onStalled={() => setDebugInfo('Video stalled - network issue')}
                onSuspend={() => setDebugInfo('Video suspended')}
                onProgress={() => setDebugInfo('Video downloading...')}
              >
                {/* Múltiples fuentes para mejor compatibilidad */}
                <source src={currentVideo.videoUrl} type="video/mp4" />
                Tu navegador no soporta video HTML5.
              </video>
              
              {/* Loading Spinner con timeout visual */}
              {isLoading && !hasError && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4"></div>
                    <div className="text-white text-sm">
                      {isMobile() ? 'Cargando...' : 'Preparando video...'}
                    </div>
                  </div>
                </div>
              )}

              {/* Mensaje para móviles sin interacción */}
              {isMobile() && !hasUserInteracted && !isLoading && !hasError && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                  <div className="text-center text-white p-6">
                    <div className="bg-yellow-400 text-black p-4 rounded-full mb-4 mx-auto w-16 h-16 flex items-center justify-center">
                      <Play className="w-8 h-8 ml-1" />
                    </div>
                    <p className="text-lg font-semibold mb-2">Toca para reproducir</p>
                    <p className="text-sm text-gray-300">Los videos requieren interacción en móviles</p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Navigation arrows */}
          {videos.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevVideo();
                }}
                className={`absolute left-4 top-1/2 -translate-y-1/2 bg-black/70 text-white p-3 rounded-full hover:bg-black/90 transition-all duration-300 z-20 backdrop-blur-sm ${
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
                className={`absolute right-4 top-1/2 -translate-y-1/2 bg-black/70 text-white p-3 rounded-full hover:bg-black/90 transition-all duration-300 z-20 backdrop-blur-sm ${
                  showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Play/Pause button central */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePlayPause();
            }}
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/70 text-white p-4 rounded-full hover:bg-black/90 transition-all duration-300 z-20 backdrop-blur-sm ${
              (showControls || (!isPlaying && hasUserInteracted)) && !isLoading && !hasError ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
          </button>

          {/* Bottom controls */}
          <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20 transition-all duration-300 ${
            showControls && hasUserInteracted ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}>
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

          {/* Video counter */}
          {videos.length > 1 && (
            <div className={`absolute top-6 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm transition-all duration-300 z-20 ${
              showControls ? 'opacity-100' : 'opacity-0'
            }`}>
              {currentVideoIndex + 1} / {videos.length}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoModal;