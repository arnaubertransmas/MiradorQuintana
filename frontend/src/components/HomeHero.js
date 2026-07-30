import Image from 'next/image';

export default function HomeHero() {
  return (
    <section className="border-b border-[#E8D2AC] bg-[#F5E3CE]">
      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-12 lg:grid-cols-2 lg:items-center">
        <div className="text-center lg:text-left">
          <div className="relative mx-auto h-24 w-24 lg:mx-0">
            <Image
              src="/logo1.png"
              alt="El Mirador de la Quintana"
              fill
              priority
              className="object-contain"
            />
          </div>
          <span className="mt-4 inline-block rounded-full bg-[#EFB37F] px-3 py-1 text-xs font-medium uppercase tracking-wider text-[#5C3410]">
            Terrassa i tapes
          </span>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#4A2E14] sm:text-4xl">
            El Mirador de la Quintana
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-[#7A5C3C] lg:mx-0">
            Tria els teus plats, personalitza&rsquo;ls i indica la teva taula.
          </p>
        </div>

        <div className="relative h-64 w-full overflow-hidden rounded-3xl">
          <Image src="/afores.jpg" alt="Terrassa del Mirador de la Quintana" fill className="object-cover" />
        </div>
      </div>
    </section>
  );
}
