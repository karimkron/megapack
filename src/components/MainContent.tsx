import React, { useState } from 'react';
import { 
  CheckCircle,
  Zap
} from 'lucide-react';
import VideoPreview from './VideoPreview';
import VideoModal from './VideoModal';

interface MainContentProps {
  onCtaClick: () => void;
}

const MainContent: React.FC<MainContentProps> = ({ onCtaClick }) => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);

  const previewVideos = [
    {
      id: 1,
      thumbnail: "/video/video1.mp4",
    },
    {
      id: 2,
      thumbnail: "/video/video2.mp4",
    },
    {
      id: 3,
      thumbnail: "/video/video3.mp4",
    },
    {
      id: 4,
      thumbnail: "/video/video4.mp4",
    },
    {
      id: 5,
      thumbnail: "/video/video5.mov",
    },
    {
      id: 6,
      thumbnail: "/video/video6.mov",
    },
    {
      id: 7,
      thumbnail: "/video/video7.mp4",
    },
    {
      id: 8,
      thumbnail: "/video/video8.mp4",
    }
  ];

  const handleVideoClick = (videoIndex: number) => {
    setSelectedVideoIndex(videoIndex);
    setIsVideoModalOpen(true);
  };
  

  return (
    <div className="pb-20">
      {/* Sección ¿Qué incluye? - Simplificada */}
      <section className="py-16 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center">
            <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              ¿Qué incluye
            </span>
            <span className="text-white"> el pack?</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 p-6 rounded-2xl border border-yellow-500/30">
              <div className="text-4xl mb-3">🔥</div>
              <h3 className="text-xl font-bold text-yellow-400 mb-2">+30,000 Videos HD</h3>
              <p className="text-gray-300">Coches de lujo, yates, mansiones, viajes premium</p>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 p-6 rounded-2xl border border-yellow-500/30">
              <div className="text-4xl mb-3">♾️</div>
              <h3 className="text-xl font-bold text-yellow-400 mb-2">Acceso de por vida</h3>
              <p className="text-gray-300">Google Drive con +4TB de contenido</p>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 p-6 rounded-2xl border border-yellow-500/30">
              <div className="text-4xl mb-3">📱</div>
              <h3 className="text-xl font-bold text-yellow-400 mb-2">Todas las redes</h3>
              <p className="text-gray-300">TikTok, Instagram, YouTube Shorts</p>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 p-6 rounded-2xl border border-yellow-500/30">
              <div className="text-4xl mb-3">⚖️</div>
              <h3 className="text-xl font-bold text-yellow-400 mb-2">Uso comercial</h3>
              <p className="text-gray-300">Monetiza sin restricciones</p>
            </div>
          </div>

          <div className="text-center">
            <button 
              onClick={onCtaClick}
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold text-lg px-8 py-4 rounded-xl hover:from-yellow-500 hover:to-yellow-700 transform hover:scale-105 transition-all duration-300 shadow-2xl"
            >
              COMPRAR AHORA
            </button>
          </div>
        </div>
      </section>

      {/* Video Preview Section */}
      <VideoPreview onVideoClick={handleVideoClick} />

      {/* Testimonios - Solo imágenes */}
      <section className="py-16 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="text-white">Resultados</span>
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                {" "}reales
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              { image: "/image/testimonio1.jpeg" },
              { image: "/image/testimonio2.jpeg" },
              { image: "/image/testimonio3.jpeg" }
            ].map((testimonial, index) => (
              <div key={index} className="group transform hover:scale-105 transition-all duration-300">
                <div className="relative rounded-xl overflow-hidden border-2 border-yellow-500/30 hover:border-yellow-400/60 transition-colors duration-300">
                  <img
                    src={testimonial.image}
                    alt={`Testimonio ${index + 1}`}
                    className="w-full h-auto object-cover"
                    loading="lazy"
                    onLoad={(e) => e.currentTarget.classList.add('loaded')}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button 
              onClick={onCtaClick}
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold text-lg px-8 py-4 rounded-xl hover:from-yellow-500 hover:to-yellow-700 transform hover:scale-105 transition-all duration-300 shadow-2xl"
            >
              COMPRAR AHORA
            </button>
          </div>
        </div>
      </section>

      {/* Sección de precio final */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-sm p-8 rounded-3xl border-2 border-yellow-500/30">
            <div className="mb-6">
              <div className="inline-flex items-center px-4 py-2 bg-red-600 rounded-full text-white font-bold text-sm mb-4 animate-pulse">
                <Zap className="w-4 h-4 mr-2" />
                ÚLTIMA OPORTUNIDAD
              </div>
            </div>

            <h3 className="text-3xl sm:text-4xl font-bold mb-6">
              <span className="text-white">Precio especial:</span>
            </h3>

            <div className="mb-8">
              <div className="text-2xl text-gray-400 line-through mb-2">97,00 €</div>
              <div className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent mb-2">
                18,95€
              </div>
              <div className="text-red-400 font-bold text-lg">¡Ahorra 78,05€!</div>
            </div>

            <div className="space-y-3 mb-8 text-left max-w-md mx-auto">
              <div className="flex items-center text-green-400">
                <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                <span>30,000 videos premium HD/4K</span>
              </div>
              <div className="flex items-center text-green-400">
                <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                <span>Acceso vitalicio sin límites</span>
              </div>
              <div className="flex items-center text-green-400">
                <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                <span>Uso comercial incluido</span>
              </div>
              <div className="flex items-center text-green-400">
                <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                <span>Entrega inmediata</span>
              </div>
            </div>

            <button 
              onClick={onCtaClick}
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold text-lg px-8 py-4 rounded-xl hover:from-yellow-500 hover:to-yellow-700 transform hover:scale-105 transition-all duration-300 shadow-2xl mb-4"
            >
              COMPRAR AHORA
            </button>

            <p className="text-sm text-gray-400 mt-4">
              💳 Pago seguro • 🔒 Garantía 100% • ⚡ Acceso inmediato
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Simplificado */}
      <section className="py-16 bg-black">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                Preguntas frecuentes
              </span>
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                question: "¿Cómo recibo el acceso?",
                answer: "Tras el pago serás redirigido a una página con el enlace directo a Google Drive. Si tienes problemas: megapack3k@gmail.com"
              },
              {
                question: "¿Son realmente 30,000 videos?",
                answer: "Sí, más de 30,000 videos en formato vertical HD/4K organizados por categorías de contenido."
              },
              {
                question: "¿Puedo monetizarlos?",
                answer: "Absolutamente. Incluye derechos de uso comercial sin restricciones."
              },
              {
                question: "¿Esta oferta es real?",
                answer: "Sí, precio promocional de 18,95€ por tiempo limitado. Precio normal: 97€."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-gray-900/50 rounded-xl border border-yellow-500/20">
                <details className="group">
                  <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-yellow-500/5 transition-colors duration-300">
                    <h3 className="font-semibold text-white">{faq.question}</h3>
                    <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 group-open:rotate-45 transition-transform duration-300">
                      <span className="text-black font-bold text-sm">+</span>
                    </div>
                  </summary>
                  <div className="px-4 pb-4">
                    <div className="pt-2 border-t border-yellow-500/20">
                      <p className="text-gray-300 text-sm">{faq.answer}</p>
                    </div>
                  </div>
                </details>
              </div>
            ))}
          </div>

          {/* Contacto de soporte */}
          <div className="mt-12 bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 p-6 rounded-2xl border border-yellow-500/30 text-center">
            <h3 className="text-xl font-bold text-white mb-3">¿Problemas de acceso?</h3>
            <div className="bg-black/30 p-4 rounded-xl">
              <p className="text-yellow-300 font-mono text-lg mb-2">megapack3k@gmail.com</p>
              <p className="text-gray-300 text-sm">Envía tu comprobante de pago - Respuesta en 2h</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer minimalista */}
      <footer className="bg-black py-8 border-t border-gray-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent mb-2">
            Mega Pack Videos de Lujo
          </div>
          <p className="text-gray-400 text-sm mb-4">Tu éxito en redes sociales empieza aquí</p>
          <p className="text-gray-500 text-xs">© 2024 Mega Pack Videos de Lujo. Todos los derechos reservados.</p>
        </div>
      </footer>

      {/* Video Modal */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videos={previewVideos}
        initialVideoIndex={selectedVideoIndex}
      />
    </div>
  );
};

export default MainContent;