import Image from 'next/image';

export default function PortalHeader({ eyebrow, title, subtitle, action, align = 'between', backgroundImage }) {
  const isCentered = align === 'center';
  const hasImage = Boolean(backgroundImage);

  return (
    <section
      className={`relative overflow-hidden border-b border-neutral-200 pt-14 pb-10 ${
        hasImage ? 'text-white' : 'bg-white pt-10 pb-8'
      }`}
    >
      {hasImage && (
        <>
          <Image
            src={backgroundImage}
            alt=""
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black/70" />
        </>
      )}
      <div
        className={
          isCentered
            ? 'relative mx-auto max-w-md px-4 text-center'
            : 'relative mx-auto flex max-w-5xl items-center justify-between gap-4 px-4'
        }
      >
        <div>
          {eyebrow && (
            <span
              className={`inline-block rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wider ${
                hasImage ? 'bg-white/20 text-white' : 'bg-brand-50 text-brand-700'
              }`}
            >
              {eyebrow}
            </span>
          )}
          <h1
            className={`mt-3 text-2xl font-bold tracking-tight sm:text-3xl ${
              hasImage ? 'text-white' : 'text-neutral-900'
            }`}
          >
            {title}
          </h1>
          {subtitle && (
            <p className={`mt-1 text-sm ${hasImage ? 'text-white/85' : 'text-neutral-500'}`}>{subtitle}</p>
          )}
        </div>
        {!isCentered && action}
      </div>
    </section>
  );
}
