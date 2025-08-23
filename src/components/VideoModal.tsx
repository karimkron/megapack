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
  const [userInteracted, setUserInteracted] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setCurrentVideoIndex(initialVideoIndex);
  }, [initialVideoIndex]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setShowControls(true);
      // Reset user interaction when modal opens
      setUserInteracted(false);
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

  // Detectar si es iOS
  const isIOS = () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
           (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  };

  // Manejar eventos del video
  const handleVideoLoad = () => {
    console.log('Video loaded');
    setIsLoading(false);
    setHasError(false);
  };

  const handleVideoCanPlay = () => {
    console.log('Video can play');
    setIsLoading(false);
    setHasError(false);
    
    // En iOS, no intentar autoplay hasta que haya interacción del usuario
    if (!isIOS() && videoRef.current && isOpen) {
      attemptPlay();
    }
  };

  const attemptPlay = async () => {
    if (!videoRef.current) return;
    
    try {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        await playPromise;
        setIsPlaying(true);
        console.log('Video started playing');
      }
    } catch (error) {
      console.log('Autoplay prevented or failed:', error);
      setIsPlaying(false);
      // En iOS, mostrar el botón de play prominentemente
      if (isIOS()) {
        setShowControls(true);
      }
    }
  };

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const videoElement = e.target as HTMLVideoElement;
    const error = videoElement.error;
    
    console.error('Video error details:', {
      code: error?.code,
      message: error?.message,
      src: videoElement.src,
      networkState: videoElement.networkState,
      readyState: videoElement.readyState
    });
    
    setIsLoading(false);
    setHasError(true);
  };

  const handleVideoPlay = () => {
    setIsPlaying(true);
  };

  const handleVideoPause = () => {
    setIsPlaying(false);
  };

  const handleVideoClick = () => {
    // En iOS, el primer click debe iniciar la reproducción
    if (isIOS() && !userInteracted && !isPlaying) {
      handlePlayClick();
    } else {
      setShowControls(!showControls);
    }
  };

  const handlePlayClick = async () => {
    setUserInteracted(true);
    
    if (videoRef.current && !hasError) {
      try {
        if (isPlaying) {
          videoRef.current.pause();
        } else {
          // Asegurar que el video esté listo
          if (videoRef.current.readyState < 3) {
            setIsLoading(true);
            await new Promise((resolve) => {
              const checkReady = () => {
                if (videoRef.current && videoRef.current.readyState >= 3) {
                  setIsLoading(false);
                  resolve(true);
                } else {
                  setTimeout(checkReady, 100);
                }
              };
              checkReady();
            });
          }
          
          const playPromise = videoRef.current.play();
          if (playPromise !== undefined) {
            await playPromise;
            console.log('Play successful after user interaction');
          }
        }
      } catch (error) {
        console.error('Play failed after user interaction:', error);
        setHasError(true);
      }
    }
    setShowControls(true);
  };

  const nextVideo = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
    setShowControls(true);
    setIsLoading(true);
    setHasError(false);
    setUserInteracted(false);
  };

  const prevVideo = () => {
    setCurrentVideoIndex((prev) => (prev - 1 + videos.length) % videos.length);
    setShowControls(true);
    setIsLoading(true);
    setHasError(false);
    setUserInteracted(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    setShowControls(true);
  };

  const retryVideo = () => {
    setHasError(false);
    setIsLoading(true);
    setUserInteracted(false);
    if (videoRef.current) {
      // Forzar recarga del video
      const currentSrc = videoRef.current.src;
      videoRef.current.src = '';
      videoRef.current.load();
      videoRef.current.src = currentSrc;
      videoRef.current.load();
    }
  };

  // Reset states when video changes
  useEffect(() => {
    setIsLoading(true);
    setIsPlaying(false);
    setHasError(false);
    setUserInteracted(false);
  }, [currentVideoIndex]);

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
            // Error state
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <div className="text-center text-white p-4">
                <p className="mb-4">Error al cargar el video</p>
                <p className="text-sm text-gray-400 mb-4">
                  Verifica que el archivo sea MP4 H.264
                </p>
                <button 
                  onClick={retryVideo}
                  className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500 transition-colors"
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
              muted={isMuted}
              playsInline={true}
              preload="metadata"
              onLoadedData={handleVideoLoad}
              onCanPlay={handleVideoCanPlay}
              onError={handleVideoError}
              onPlay={handleVideoPlay}
              onPause={handleVideoPause}
              controlsList="nodownload nofullscreen"
              disablePictureInPicture
              // Atributos adicionales para iOS (correctamente escritos para React)
              {...(isIOS() && {
                'webkit-playsinline': 'true',
                'x5-playsinline': 'true',
                'x5-video-player-type': 'h5-page',
                'x5-video-player-fullscreen': 'false'
              })}
            />
          )}

          {/* Loading Spinner */}
          {isLoading && !hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="text-center text-white">
                <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-sm">Cargando video...</p>
              </div>
            </div>
          )}

          {/* Play button prominente para iOS */}
          {isIOS() && !userInteracted && !isPlaying && !isLoading && !hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <button
                onClick={handlePlayClick}
                className="bg-yellow-400/90 rounded-full p-6 transform hover:scale-110 transition-transform duration-300 shadow-lg"
              >
                <Play className="w-12 h-12 text-black fill-current ml-1" />
              </button>
            </div>
          )}

          {/* Navigation arrows */}
          {videos.length > 1 && (
            <>
              <button
                onClick={prevVideo}
                className={`absolute left-4 top-1/2 -translate-y-1/2 bg-black/70 text-white p-3 rounded-full hover:bg-black/90 transition-all duration-300 z-20 backdrop-blur-sm ${
                  showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={nextVideo}
                className={`absolute right-4 top-1/2 -translate-y-1/2 bg-black/70 text-white p-3 rounded-full hover:bg-black/90 transition-all duration-300 z-20 backdrop-blur-sm ${
                  showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Play/Pause button central (solo después de interacción) */}
          {(!isIOS() || userInteracted) && (
            <button
              onClick={handlePlayClick}
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/70 text-white p-4 rounded-full hover:bg-black/90 transition-all duration-300 z-20 backdrop-blur-sm ${
                showControls && !isLoading && !hasError ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
            </button>
          )}

          {/* Bottom controls */}
          <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20 transition-all duration-300 ${
            showControls && (!isIOS() || userInteracted) ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}>
            <button
              onClick={toggleMute}
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

          {/* Indicador específico para iOS */}
          {isIOS() && !userInteracted && !isLoading && !hasError && (
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center z-20">
              <p className="text-white/80 text-sm bg-black/50 px-4 py-2 rounded-full">
                Toca para reproducir
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoModal;