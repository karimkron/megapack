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
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setCurrentVideoIndex(initialVideoIndex);
    // Resetear estados cuando cambia el video y mostrar controles
    setIsLoading(true);
    setIsPlaying(false);
    setShowControls(true);
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
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile && !isPlaying) {
        return; // No iniciar timer si estamos en móvil y el video está pausado
      }
      
      const timeout = setTimeout(() => {
        setShowControls(false);
      }, 4000); // Cambiado de 2000 a 4000ms (4 segundos)
      
      setControlsTimeout(timeout);
    }
    
    return () => {
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
    };
  }, [showControls, isPlaying]);

  // Show controls when clicking on video
  const handleVideoClick = () => {
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
  };

  const prevVideo = () => {
    setCurrentVideoIndex((prev) => (prev - 1 + videos.length) % videos.length);
    setShowControls(true);
    setIsLoading(true);
    setIsPlaying(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    setShowControls(true);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch((error) => {
          console.log('Error al reproducir video:', error);
          setIsPlaying(false);
        });
      }
      setShowControls(true);
    }
  };

  const handleVideoLoadStart = () => {
    setIsLoading(true);
    setIsPlaying(false);
  };

  const handleVideoCanPlay = () => {
    setIsLoading(false);
    // Solo auto-reproducir en escritorio, en móvil esperar interacción del usuario
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (!isMobile && videoRef.current) {
      videoRef.current.play().catch(() => {
        // Si falla el autoplay, no hacer nada
        setIsPlaying(false);
      });
    } else {
      // En móvil, asegurar que los controles estén visibles
      setShowControls(true);
    }
  };

  const handleVideoPlay = () => {
    setIsPlaying(true);
  };

  const handleVideoPause = () => {
    setIsPlaying(false);
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
          id="video-container" 
          className="relative bg-black overflow-hidden rounded-lg" 
          style={{ aspectRatio: '9/16' }}
          onClick={handleVideoClick}
        >
          <video
            ref={videoRef}
            src={currentVideo.thumbnail}
            className="w-full h-full object-contain"
            muted={isMuted}
            controls={false}
            playsInline
            webkit-playsinline="true"
            preload="metadata"
            onClick={handleVideoClick}
            onLoadStart={handleVideoLoadStart}
            onCanPlay={handleVideoCanPlay}
            onPlay={handleVideoPlay}
            onPause={handleVideoPause}
            onError={() => {
              setIsLoading(false);
              console.log('Error cargando video');
            }}
          />

          {/* Loading spinner */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="w-12 h-12 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
            </div>
          )}

          {/* Play/Pause button overlay */}
          {!isLoading && (
            <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
              showControls && !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}>
              <button
                onClick={togglePlay}
                className="bg-black/50 text-white p-4 rounded-full hover:bg-black/70 transition-all duration-300 backdrop-blur-sm"
              >
                <Play className="w-8 h-8 ml-1" />
              </button>
            </div>
          )}

          {/* Navigation arrows */}
          <button
            onClick={prevVideo}
            className={`absolute left-4 top-1/2 -translate-y-1/2 bg-black/70 text-white p-3 rounded-full hover:bg-black/90 transition-all duration-300 z-10 backdrop-blur-sm ${
              showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextVideo}
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
              onClick={togglePlay}
              className="bg-black/70 text-white p-3 rounded-full hover:bg-black/90 transition-colors backdrop-blur-sm"
              disabled={isLoading}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>
            
            {/* Mute button */}
            <button
              onClick={toggleMute}
              className="bg-black/70 text-white p-3 rounded-full hover:bg-black/90 transition-colors backdrop-blur-sm"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;