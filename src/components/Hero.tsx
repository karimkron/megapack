import React from "react";
import CountdownTimer from "./CountdownTimer";

interface HeroProps {
  onCtaClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onCtaClick }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
        {/* Video de fondo */}
        <video
          className="absolute inset-0 w-full h-full object-cover opacity-30 z-0"
          src="/video/fondo.mp4"
          autoPlay
          muted
          loop
          playsInline
        ></video>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-80"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
        {/* Countdown Timer */}
        <div className="mb-6 mt-10">
          <CountdownTimer />
        </div>

        {/* Título optimizado para móviles */}
        <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold mb-4 leading-tight">
          <span className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-600 bg-clip-text text-transparent">
            30.000 Videos
          </span>
          <br />
          <span className="text-white font-serif text-2xl sm:text-4xl lg:text-5xl">
            de Lujo Exclusivos
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Transforma tu perfil en una marca de lujo
          <span className="text-yellow-400 font-semibold block">
            ¡Contenido viral garantizado!
          </span>
        </p>

        {/* Precio destacado */}
        <div className="mb-8">
          <div className="text-gray-400 line-through text-lg mb-1">97,00 €</div>
          <div className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent mb-2">
            18,95 €
          </div>
          <div className="text-red-400 font-bold text-lg animate-pulse">
            81% DESCUENTO
          </div>
        </div>

        {/* CTA Principal */}
        <div className="space-y-4 mb-8">
          <div className="transform hover:scale-105 transition-all duration-300">
            <button
              onClick={onCtaClick}
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold text-lg px-8 py-4 rounded-xl hover:from-yellow-500 hover:to-yellow-700 transform hover:scale-105 transition-all duration-300 shadow-2xl"
            >
              COMPRAR AHORA
            </button>
          </div>
          <p className="text-sm text-gray-400">
            ⚡ Entrega instantánea • 🔒 Pago seguro • 💎 Garantía 100%
          </p>
        </div>

        {/* Beneficios rápidos */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
          <div className="bg-black/40 backdrop-blur-sm p-4 rounded-xl">
            <div className="text-yellow-400 font-bold">+30K Videos</div>
            <div className="text-sm text-gray-300">Calidad 4K</div>
          </div>
          <div className="bg-black/40 backdrop-blur-sm p-4 rounded-xl">
            <div className="text-yellow-400 font-bold">Acceso Vitalicio</div>
            <div className="text-sm text-gray-300">Sin límites</div>
          </div>
          <div className="bg-black/40 backdrop-blur-sm p-4 rounded-xl">
            <div className="text-yellow-400 font-bold">Uso Comercial</div>
            <div className="text-sm text-gray-300">Sin restricciones</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
