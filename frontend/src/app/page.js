import PortalHeader from '@/components/PortalHeader';
import MenuExplorer from '@/components/MenuExplorer';
import Footer from '@/components/Footer';
import { getDishes } from '@/lib/api';

export default async function HomePage() {
  let dishes = [];
  let error = null;

  try {
    dishes = await getDishes();
  } catch (err) {
    error = err.message;
  }

  return (
    <main>
      <PortalHeader
        eyebrow="Estiu 2026"
        title="El Mirador de la Quintana"
        subtitle="Tria els teus plats, personalitza’ls i indica la teva taula."
        align="center"
      />

      <div className="pt-10">
        {error && (
          <div className="mx-auto max-w-6xl px-4">
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              No s&apos;ha pogut carregar la carta: {error}
            </div>
          </div>
        )}

        {!error && dishes.length === 0 && (
          <div className="mx-auto max-w-6xl px-4">
            <div className="rounded-xl border border-neutral-200 bg-white p-8 text-center text-neutral-500">
              La carta està buida ara mateix.
            </div>
          </div>
        )}

        {!error && dishes.length > 0 && <MenuExplorer dishes={dishes} />}

        <Footer />
      </div>
    </main>
  );
}
