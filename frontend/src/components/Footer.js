const HOURS = [
  { day: 'Dilluns', hours: 'Tancat' },
  { day: 'Dimarts', hours: '8:00–22:00' },
  { day: 'Dimecres', hours: '8:00–22:00' },
  { day: 'Dijous', hours: '8:00–22:00' },
  { day: 'Divendres', hours: '8:00–0:00' },
  { day: 'Dissabte', hours: '8:00–0:00' },
  { day: 'Diumenge', hours: '8:00–23:00' },
];

const ADDRESS = 'Av. Sta. Coloma - Av. Moianès, 08183, 08183, Barcelona';
const MAPS_URL = `https://maps.app.goo.gl/v6psJcWjJRrtngwP9`;

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-8 px-4 py-10 sm:flex-row">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-400">Horari</h2>
          <ul className="mt-3 space-y-1 text-sm">
            {HOURS.map(({ day, hours }) => (
              <li key={day} className="flex justify-between gap-4">
                <span className={hours === 'Tancat' ? 'text-neutral-400' : 'text-neutral-700'}>{day}</span>
                <span className={hours === 'Tancat' ? 'text-neutral-400' : 'font-medium text-neutral-900'}>
                  {hours}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-400">Troba&apos;ns</h2>
          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 block text-sm text-neutral-700 hover:text-brand-600"
          >
            {ADDRESS}
          </a>
          <a
            href="tel:+34651096816"
            className="mt-2 inline-block text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            📞 651 09 68 16
          </a>
        </div>
      </div>
    </footer>
  );
}

