import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Play, Pause, VolumeX, Volume2 } from 'lucide-react';

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
  const [isMuted, setIsMuted] = useState(true); // Iniciamos muteado para iOS
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setCurrentVideoIndex(initialVideoIndex);
  }, [initialVideoIndex]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setShowControls(true); // Mostrar controles al abrir
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Auto-hide controls after 4 seconds
  useEffect(() => {
    if (showControls && isOpen) {
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
      
      const timeout = setTimeout(() => {
        setShowControls(false);
      }, 4000); // Cambiado a 4 segundos
      
      setControlsTimeout(timeout);
    }
    
    return () => {
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
    };
  }, [showControls, isOpen]);

  // Manejar eventos del video
  const handleVideoLoad = () => {
    setIsLoading(false);
    // Intentar reproducir automáticamente
    if (videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            console.log('Autoplay prevented:', error);
            setIsPlaying(false);
          });
      }
    }
  };

  const handleVideoError = () => {
    setIsLoading(false);
    console.error('Error loading video');
  };

  const handleVideoPlay = () => {
    setIsPlaying(true);
  };

  const handleVideoPause = () => {
    setIsPlaying(false);
  };

  // Toggle controles al tocar la pantalla
  const handleVideoClick = () => {
    setShowControls(!showControls);
  };

  const nextVideo = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
    setShowControls(true);
    setIsLoading(true);
  };

  const prevVideo = () => {
    setCurrentVideoIndex((prev) => (prev - 1 + videos.length) % videos.length);
    setShowControls(true);
    setIsLoading(true);
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
    setShowControls(true);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    setShowControls(true);
  };

  // Reset loading state when video changes
  useEffect(() => {
    setIsLoading(true);
    setIsPlaying(false);
  }, [currentVideoIndex]);

  if (!isOpen) return null;

  const currentVideo = videos[currentVideoIndex];

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <div className="relative w-full max-w-sm mx-auto h-full flex items-center justify-center p-4">
        
        {/* Close button - Reposicionado */}
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
          <video
            ref={videoRef}
            src={currentVideo.thumbnail}
            className="w-full h-full object-contain"
            muted={isMuted}
            playsInline // Crucial para iOS - evita pantalla completa automática
            preload="metadata"
            onLoadedData={handleVideoLoad}
            onError={handleVideoError}
            onPlay={handleVideoPlay}
            onPause={handleVideoPause}
            controlsList="nodownload nofullscreen" // Oculta botón de pantalla completa
            disablePictureInPicture // Desactiva picture-in-picture
          />

          {/* Loading Spinner */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
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

          {/* Play/Pause button central */}
          <button
            onClick={togglePlayPause}
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/70 text-white p-4 rounded-full hover:bg-black/90 transition-all duration-300 z-20 backdrop-blur-sm ${
              showControls && !isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
          </button>

          {/* Bottom controls */}
          <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20 transition-all duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}>
            {/* Mute button */}
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
        </div>
      </div>
    </div>
  );
};

export default VideoModal;