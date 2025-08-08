import React from 'react';
import { Play } from 'lucide-react';

interface VideoPreviewProps {
  onVideoClick: (videoIndex: number) => void;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({ onVideoClick }) => {
  const previewVideos = [
    {
      id: 1,
      thumbnail: "/thumbnails/thumb1.png",
    },
    {
      id: 2,
      thumbnail: "/thumbnails/thumb2.png",
    },
    {
      id: 3,
      thumbnail: "/thumbnails/thumb3.png",
    },
    {
      id: 4,
      thumbnail: "/thumbnails/thumb4.png",
    },
    {
      id: 5,
      thumbnail: "/thumbnails/thumb5.png",
    },
    {
      id: 6,
      thumbnail: "/thumbnails/thumb6.png",
    },
    {
      id: 7,
      thumbnail: "/thumbnails/thumb7.png",
    },
    {
      id: 8,
      thumbnail: "/thumbnails/thumb8.png",
    }
  ];

  

  return (
    <div className="py-12 px-4 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">
            <span className="text-yellow-400">Vista Previa</span> <span className="text-white">de la Calidad</span>
          </h2>
          <p className="text-gray-400 text-sm">
            Mira algunos ejemplos de los videos que obtendrás
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-8">
          {previewVideos.map((video, index) => (
            <div key={video.id} className="relative group cursor-pointer" onClick={() => onVideoClick(index)}>
              <div className="relative overflow-hidden rounded-lg" style={{ aspectRatio: '9/16' }}>
                <img 
                  src={video.thumbnail} 
                  alt={`Video ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300"></div>
                
                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-yellow-400/90 rounded-full p-3 transform group-hover:scale-110 transition-transform duration-300">
                    <Play className="w-5 h-5 text-black fill-current" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-yellow-400/20 border border-yellow-400/30 px-4 py-2 rounded-full">
            <span className="text-yellow-400 text-sm font-semibold">+30,000 videos más te esperan</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPreview;