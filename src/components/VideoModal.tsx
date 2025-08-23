import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Play, Pause, VolumeX, Volume2 } from 'lucide-react';

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
  
  const videoRef = useRef<HTMLVideoElement>(null);

  // Detectar si es iOS
  const isIOS = () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
           (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  };

  useEffect(() => {
    setCurrentVideoIndex(initialVideoIndex);
  }, [initialVideoIndex]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setShowControls(true);
      setHasUserInteracted(false); // Reset interaction state
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Auto-hide controls after 4 seconds
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
    
    return () => {
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
    };
  }, [showControls, isOpen, isPlaying]);

  // Reset states when video changes
  useEffect(() => {
    setIsLoading(true);
    setIsPlaying(false);
    setHasError(false);
  }, [currentVideoIndex]);

  const handleVideoLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleVideoCanPlay = async () => {
    setIsLoading(false);
    setHasError(false);
    
    // En iOS, NO intentar autoplay hasta que el usuario interactúe
    if (!isIOS() && isOpen && videoRef.current) {
      try {
        await videoRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.log('Autoplay prevented:', error);
        setIsPlaying(false);
      }
    }
  };

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    setIsLoading(false);
    setHasError(true);
    console.error('Error loading video:', e);
  };

  const handleVideoPlay = () => {
    setIsPlaying(true);
  };

  const handleVideoPause = () => {
    setIsPlaying(false);
  };

  const handleVideoClick = () => {
    // Marcar que el usuario ha interactuado
    if (!hasUserInteracted) {
      setHasUserInteracted(true);
    }
    
    if (isPlaying) {
      setShowControls(!showControls);
    } else {
      // Si el video no está reproduciendo, intentar reproducir
      togglePlayPause();
    }
  };

  const nextVideo = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
    setShowControls(true);
    setIsLoading(true);
    setHasError(false);
    setHasUserInteracted(false); // Reset interaction para el nuevo video
  };

  const prevVideo = () => {
    setCurrentVideoIndex((prev) => (prev - 1 + videos.length) % videos.length);
    setShowControls(true);
    setIsLoading(true);
    setHasError(false);
    setHasUserInteracted(false); // Reset interaction para el nuevo video
  };

  const togglePlayPause = async () => {
    if (!videoRef.current || hasError) return;
    
    setHasUserInteracted(true);
    
    try {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        // Para iOS, asegurar que el video esté listo
        if (videoRef.current.readyState >= 2) {
          await videoRef.current.play();
        } else {
          // Esperar a que esté listo
          videoRef.current.addEventListener('canplay', async () => {
            try {
              await videoRef.current!.play();
            } catch (error) {
              console.error('Play failed:', error);
              setHasError(true);
            }
          }, { once: true });
        }
      }
    } catch (error) {
      console.error('Play failed:', error);
      setHasError(true);
    }
    
    setShowControls(true);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    setShowControls(true);
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

        {/* Video container */}
        <div 
          className="relative bg-black overflow-hidden rounded-lg w-full" 
          style={{ aspectRatio: '9/16', maxHeight: '80vh' }}
          onClick={handleVideoClick}
        >
          {hasError ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <div className="text-center text-white">
                <p className="mb-4">Error al cargar el video</p>
                <button 
                  onClick={() => {
                    setHasError(false);
                    setIsLoading(true);
                    setHasUserInteracted(false);
                    if (videoRef.current) {
                      videoRef.current.load();
                    }
                  }}
                  className="bg-yellow-400 text-black px-4 py-2 rounded"
                >
                  Reintentar
                </button>
              </div>
            </div>
          ) : (
            <video
              ref={videoRef}
              src={currentVideo.videoUrl}
              poster={currentVideo.thumbnail}
              className="w-full h-full object-contain"
              // ORDEN CRÍTICO PARA IOS: muted ANTES que otros atributos
              muted={isMuted}
              playsInline
              preload="metadata"
              controlsList="nodownload nofullscreen noremoteplayback"
              disablePictureInPicture
              // Atributos específicos para iOS
              webkit-playsinline="true"
              x5-playsinline="true"
              x5-video-player-type="h5"
              x5-video-player-fullscreen="true"
              // NO usar autoplay en iOS - causará problemas
              {...(!isIOS() && { autoplay: true })}
              // Event handlers
              onLoadedData={handleVideoLoad}
              onCanPlay={handleVideoCanPlay}
              onError={handleVideoError}
              onPlay={handleVideoPlay}
              onPause={handleVideoPause}
              // Eventos adicionales para mejor compatibilidad con iOS
              onLoadStart={() => setIsLoading(true)}
              onWaiting={() => setIsLoading(true)}
              onPlaying={() => setIsLoading(false)}
            />
          )}

          {/* Loading Spinner */}
          {isLoading && !hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            </div>
          )}

          {/* Mensaje específico para iOS cuando no hay interacción */}
          {isIOS() && !hasUserInteracted && !isLoading && !hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="text-center text-white p-4">
                <div className="bg-yellow-400 text-black p-4 rounded-full mb-4 mx-auto w-16 h-16 flex items-center justify-center">
                  <Play className="w-8 h-8 ml-1" />
                </div>
                <p className="text-sm">Toca para reproducir</p>
              </div>
            </div>
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