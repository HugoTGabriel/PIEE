import React, { useState, useEffect } from 'react';

const images = [
  {
    url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1350&q=80",
    label: "Pratos do Dia"
  },
  {
    url: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?auto=format&fit=crop&w=1350&q=80",
    label: "Sabores Incríveis"
  },
  {
    url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1350&q=80",
    label: "Alta Gastronomia"
  },
  {
    url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1350&q=80",
    label: "Receitas Caseiras"
  },
  {
    url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1350&q=80",
    label: "Para Toda Família"
  }
];

const Hero = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % images.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="hero" style={{ position: 'relative', overflow: 'hidden', padding: 0, marginBottom: '40px' }}>

      {/* Faixa de imagens deslizando */}
      <div
        style={{
          display: 'flex',
          width: `${images.length * 100}%`,
          height: '420px',
          transform: `translateX(-${(current * 100) / images.length}%)`,
          transition: 'transform 0.9s cubic-bezier(0.77, 0, 0.18, 1)',
        }}
      >
        {images.map((img, i) => (
          <div
            key={i}
            style={{
              width: `${100 / images.length}%`,
              height: '100%',
              flexShrink: 0,
              backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url(${img.url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        ))}
      </div>

      {/* Texto por cima */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        textAlign: 'center',
        padding: '0 20px',
        pointerEvents: 'none',
      }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '16px', textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
          Descubra Sabores Incríveis
        </h1>
        <p style={{ fontSize: '1.2rem', maxWidth: '600px', textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
          Explore centenas de receitas deliciosas e fáceis de fazer para todos os momentos do seu dia.
        </p>
        {/* Label da imagem atual */}
        <span style={{
          marginTop: '24px',
          background: 'rgba(255,107,107,0.85)',
          padding: '6px 18px',
          borderRadius: '20px',
          fontSize: '0.9rem',
          fontWeight: '500',
          letterSpacing: '0.5px',
        }}>
          {images[current].label}
        </span>
      </div>

      {/* Indicadores (bolinhas) */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '8px',
      }}>
        {images.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === current ? '22px' : '8px',
              height: '8px',
              borderRadius: '4px',
              background: i === current ? '#ff6b6b' : 'rgba(255,255,255,0.5)',
              transition: 'all 0.4s ease',
              cursor: 'pointer',
            }}
          />
        ))}
      </div>

    </section>
  );
};

export default Hero;