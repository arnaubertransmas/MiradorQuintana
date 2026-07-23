export default function PortalHeader({ eyebrow, title, subtitle, action, align = 'between' }) {
  const isCentered = align === 'center';

  return (
    <section className="border-b border-neutral-200 bg-white pb-8 pt-10">
      <div
        className={
          isCentered
            ? 'mx-auto max-w-md px-4 text-center'
            : 'mx-auto flex max-w-5xl items-center justify-between gap-4 px-4'
        }
      >
        <div>
          {eyebrow && (
            <span className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-medium uppercase tracking-wider text-brand-700">
              {eyebrow}
            </span>
          )}
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-neutral-500">{subtitle}</p>}
        </div>
        {!isCentered && action}
      </div>
    </section>
  );
}
