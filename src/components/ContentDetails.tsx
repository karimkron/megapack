import React from 'react';
import { 
  Users, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Award,
  Target,
  Play,
  CheckCircle,
  Zap
} from 'lucide-react';

interface ContentDetailsProps {
  onCtaClick: () => void;
}

const ContentDetails: React.FC<ContentDetailsProps> = ({ onCtaClick }) => {
  const benefits = [
    {
      icon: <Award className="w-5 h-5" />,
      title: "El pack más completo y exclusivo",
      description: "Ningún otro paquete ofrece esta cantidad y calidad de contenido"
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      title: "Más viralidad en redes",
      description: "Tus publicaciones ganarán tracción con videos impactantes"
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "Ahorra tiempo y dinero",
      description: "No necesitas crear contenido desde cero"
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Gana autoridad y seguidores",
      description: "Eleva tu imagen con videos profesionales"
    },
    {
      icon: <DollarSign className="w-5 h-5" />,
      title: "Monetiza fácilmente",
      description: "Usa los videos para atraer clientes y aumentar ingresos"
    }
  ];

  const targetAudience = [
    "Creadores de contenido que buscan viralidad inmediata",
    "Emprendedores que necesitan contenido impactante",
    "Agencias de marketing y editores de video",
    "Marcas y negocios que buscan diferenciarse",
    "Personas que no logran viralizar su contenido",
    "Dueños de negocios con marca estancada"
  ];

  const categories = [
    "Lujo & Estilo de vida millonario",
    "Superación personal",
    "Negocios & Emprendimiento",
    "Motivación & Éxito"
  ];

  return (
    <div className="py-16 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-5xl mx-auto px-4">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-yellow-400/20 border border-yellow-400/30 rounded-full mb-6">
            <Zap className="w-4 h-4 mr-2 text-yellow-400" />
            <span className="text-yellow-400 font-semibold text-sm">EXCLUSIVO EN EL MERCADO</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            <span className="text-white">¿Estás listo para llevar tu contenido</span>
            <br />
            <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              al siguiente nivel?
            </span>
          </h2>
          
          <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Imagina tener acceso inmediato a una colección exclusiva de <strong className="text-yellow-400">+30,000 videos en HD</strong> diseñados para inspirar, motivar y reflejar una mentalidad millonaria. Este paquete es tu llave maestra para destacar en el mundo digital sin complicaciones.
          </p>
        </div>

        {/* What is it Section */}
        <div className="mb-16">
          <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 p-8 rounded-2xl border border-yellow-500/20">
            <h3 className="text-2xl font-bold text-yellow-400 mb-4 text-center">
              ¿Qué es el Mega Pack de Videos Virales de Lujo?
            </h3>
            <p className="text-gray-300 text-center text-lg leading-relaxed max-w-4xl mx-auto">
              Son videos de alta calidad en formato de Reel con derechos de uso que puedes utilizar en IG, TikTok y YouTube Shorts. 
              Es como tener un equipo de producción a tu disposición, pero <strong className="text-yellow-400">sin los costos ni el tiempo de creación</strong>. 
              Personalízalos a tu gusto o súbelos tal cual como están y mira cómo tus cuentas crecen.
            </p>
            
            <div className="mt-6 text-center">
              <div className="inline-flex items-center px-6 py-3 bg-black/30 rounded-xl">
                <Play className="w-5 h-5 mr-3 text-yellow-400" />
                <span className="text-white font-semibold">Acceso instantáneo en Google Drive</span>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8">
            <span className="text-white">No existe otro paquete</span>
            <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent"> como este</span>
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-black/40 backdrop-blur-sm p-6 rounded-xl border border-yellow-500/20 hover:border-yellow-400/40 transition-all duration-300">
                <div className="text-yellow-400 mb-3">
                  {benefit.icon}
                </div>
                <h4 className="font-bold text-white mb-2">{benefit.title}</h4>
                <p className="text-gray-300 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <button 
              onClick={onCtaClick}
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold text-lg px-8 py-4 rounded-xl hover:from-yellow-500 hover:to-yellow-700 transform hover:scale-105 transition-all duration-300 shadow-2xl"
            >
              OBTENER ACCESO AHORA
            </button>
          </div>
        </div>

        {/* Target Audience */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8">
            <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">¿Para Quién</span>
            <span className="text-white"> es Este Pack?</span>
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {targetAudience.map((audience, index) => (
              <div key={index} className="flex items-center bg-gray-900/50 p-4 rounded-xl border border-yellow-500/20">
                <div className="text-yellow-400 mr-3 flex-shrink-0">
                  <Target className="w-5 h-5" />
                </div>
                <span className="text-gray-300">{audience}</span>
              </div>
            ))}
          </div>
        </div>

        {/* What You Get */}
        <div className="mb-16">
          <div className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-sm p-8 rounded-3xl border-2 border-yellow-500/30">
            <h3 className="text-2xl font-bold text-center mb-8">
              <span className="text-white">¿Qué obtienes</span>
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent"> al comprar?</span>
            </h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div>
                <div className="flex items-center mb-6">
                  <div className="text-4xl mr-4">🔥</div>
                  <div>
                    <h4 className="text-xl font-bold text-yellow-400">+30,000 videos HD</h4>
                    <p className="text-gray-300">Calidad profesional garantizada</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h5 className="font-bold text-white mb-3">Categorías exclusivas:</h5>
                  {categories.map((category, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-3 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">{category}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Right Column */}
              <div>
                <div className="bg-black/30 p-6 rounded-xl">
                  <h5 className="font-bold text-yellow-400 mb-4">Formatos compatibles:</h5>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 p-3 rounded-lg text-center">
                      <span className="text-white font-semibold text-sm">TikTok</span>
                    </div>
                    <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-3 rounded-lg text-center">
                      <span className="text-white font-semibold text-sm">Instagram</span>
                    </div>
                    <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 p-3 rounded-lg text-center">
                      <span className="text-white font-semibold text-sm">YouTube Shorts</span>
                    </div>
                    <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-3 rounded-lg text-center">
                      <span className="text-white font-semibold text-sm">Facebook Reels</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 bg-green-900/20 border border-green-500/30 p-4 rounded-xl">
                  <div className="flex items-center text-green-400 mb-2">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    <span className="font-semibold">Tuyos para siempre</span>
                  </div>
                  <p className="text-gray-300 text-sm">Sin pagos adicionales ni tarifas ocultas</p>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <button 
                onClick={onCtaClick}
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold text-lg px-8 py-4 rounded-xl hover:from-yellow-500 hover:to-yellow-700 transform hover:scale-105 transition-all duration-300 shadow-2xl"
              >
                COMPRAR AHORA - 18,95€
              </button>
              <p className="text-sm text-gray-400 mt-3">
                🚀 Acceso inmediato • 💾 Google Drive • ♾️ Para siempre
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentDetails;