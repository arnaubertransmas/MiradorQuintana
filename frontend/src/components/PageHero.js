'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function PageHero({ tagline = 'Menjar & Comunitat', caption, subtitle, action, extraImages }) {
  const slides = extraImages?.length
    ? [
        { src: '/afores.jpg', alt: 'Terrassa del Mirador de la Quintana', position: 'object-[35%_82%]' },
        ...extraImages.map((image) => ({ ...image, position: image.position ?? 'object-center' })),
      ]
    : null;

  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (!slides) return undefined;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slides]);

  return (
    <section className="relative border-b border-[#E8D2AC] bg-[#F5E3CE]">
      {action && <div className="absolute right-4 top-4 sm:right-6 sm:top-6">{action}</div>}

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 lg:grid-cols-2 lg:items-center">
        <div className="text-center lg:text-left">
          <div className="relative mx-auto h-40 w-40 lg:mx-0">
            <Image
              src="/logo1.png"
              alt="El Mirador de la Quintana"
              fill
              priority
              className="object-contain"
            />
          </div>
          <span className="mt-4 inline-block rounded-full bg-[#EFB37F] px-3 py-1 text-xs font-medium uppercase tracking-wider text-[#5C3410]">
            {tagline}
          </span>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#4A2E14] sm:text-4xl">
            El Mirador de la Quintana
          </h1>
          {caption && (
            <p className="mt-1 text-sm font-medium uppercase tracking-wide text-[#9C7B52]">{caption}</p>
          )}
          {subtitle && <div className="mx-auto mt-3 max-w-sm text-[#7A5C3C] lg:mx-0">{subtitle}</div>}
        </div>

        {slides ? (
          <div className="relative h-[300px] w-full overflow-hidden rounded-3xl">
            {slides.map((slide, index) => (
              <div
                key={slide.src}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  index === activeSlide ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {slide.fit === 'contain' ? (
                  <div className="flex h-full w-full items-center justify-center p-3">
                    <Image
                      src={slide.src}
                      alt={slide.alt}
                      width={800}
                      height={600}
                      className="max-h-full max-w-full rounded-2xl object-contain"
                    />
                  </div>
                ) : (
                  <Image src={slide.src} alt={slide.alt} fill className={`object-cover ${slide.position}`} />
                )}
              </div>
            ))}
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
              {slides.map((slide, index) => (
                <button
                  key={slide.src}
                  type="button"
                  onClick={() => setActiveSlide(index)}
                  aria-label={`Mostra la imatge ${index + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    index === activeSlide ? 'w-5 bg-white' : 'w-1.5 bg-white/60'
                  }`}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="relative h-[270px] w-full overflow-hidden rounded-3xl">
            <Image
              src="/afores.jpg"
              alt="Terrassa del Mirador de la Quintana"
              fill
              className="object-cover object-[35%_85%]"
            />
          </div>
        )}
      </div>
    </section>
  );
}
