import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, VolumeX, Volume2 } from 'lucide-react';

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

  useEffect(() => {
    setCurrentVideoIndex(initialVideoIndex);
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

  // Auto-hide controls after 4 seconds
  useEffect(() => {
    if (showControls) {
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
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
  }, [showControls]);

  // Show controls when clicking on video
  const handleVideoClick = () => {
    setShowControls(true);
  };

  const nextVideo = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
    setShowControls(true);
  };

  const prevVideo = () => {
    setCurrentVideoIndex((prev) => (prev - 1 + videos.length) % videos.length);
    setShowControls(true);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    setShowControls(true);
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
            src={currentVideo.thumbnail}
            className="w-full h-full object-contain"
            muted={isMuted}
            autoPlay
            controls={false}
            playsInline
            webkit-playsinline="true"
            onClick={handleVideoClick}
          />

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
          <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4 z-10 transition-all duration-300 ${
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
        </div>
      </div>
    </div>
  );
};

export default VideoModal;