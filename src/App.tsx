import { useState, useEffect } from 'react';
import Hero from './components/Hero';
import MainContent from './components/MainContent';
import FixedCTA from './components/FixedCTA';

function App() {
  const [showFixedCTA, setShowFixedCTA] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight * 0.9;
      const scrollPosition = window.scrollY;
      
      // Show CTA when user scrolls past the hero section
      setShowFixedCTA(scrollPosition > heroHeight);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCtaClick = () => {
    // Verificar si ya existe un modal
    if (document.getElementById('stripe-modal')) {
      return;
    }

    // Crear modal
    const modal = document.createElement('div');
    modal.id = 'stripe-modal';
    modal.className = 'fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4';
    
    modal.innerHTML = `
      <div class="bg-white rounded-2xl p-6 max-w-md w-full relative shadow-2xl">
        <button 
          class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors" 
          onclick="document.getElementById('stripe-modal').remove()"
        >
          ×
        </button>
        <div class="text-center mb-6">
          <h3 class="text-2xl font-bold text-gray-800 mb-2">Completar Compra</h3>
          <p class="text-gray-600">Megapack de Videos de Lujo</p>
          <div class="mt-4">
            <span class="text-3xl font-bold text-green-600">€18.95</span>
            <span class="text-gray-500 line-through ml-2">€97.00</span>
          </div>
        </div>
        <div id="stripe-container" class="flex justify-center"></div>
      </div>
    `;

    document.body.appendChild(modal);

    // Cargar Stripe y crear botón
    const loadStripe = () => {
      const stripeButton = document.createElement('stripe-buy-button');
      stripeButton.setAttribute('buy-button-id', 'buy_btn_1Rr68CLaDNozqJeSJQvmCkuQ');
      stripeButton.setAttribute('publishable-key', 'pk_live_51RRNGqLaDNozqJeSsBCif37utfiEfn2lcvPrCCuJ4RpJMNKT3ohVa0Kvy2vnaFbEOO231uSs424Bh1eyEkM9lZ8500P7IXhWnI');
      
      const container = document.getElementById('stripe-container');
      if (container) {
        container.appendChild(stripeButton);
      }
    };

    // Verificar si Stripe ya está cargado
    if (customElements.get('stripe-buy-button')) {
      loadStripe();
    } else {
      // Cargar script de Stripe si no está cargado
      if (!document.querySelector('script[src="https://js.stripe.com/v3/buy-button.js"]')) {
        const script = document.createElement('script');
        script.src = 'https://js.stripe.com/v3/buy-button.js';
        script.async = true;
        script.onload = loadStripe;
        document.head.appendChild(script);
      } else {
        // Si el script ya existe, esperar a que se cargue
        const checkStripe = setInterval(() => {
          if (customElements.get('stripe-buy-button')) {
            clearInterval(checkStripe);
            loadStripe();
          }
        }, 100);
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <Hero onCtaClick={handleCtaClick} />
      <MainContent onCtaClick={handleCtaClick} />
      <FixedCTA onClick={handleCtaClick} isVisible={showFixedCTA} />
    </div>
  );
}

export default App;