import PageHero from '@/components/PageHero';
import MenuExplorer from '@/components/MenuExplorer';
import Footer from '@/components/Footer';
import { getDishes } from '@/lib/api';

export default async function HomePage({ searchParams }) {
  let dishes = [];
  let error = null;

  try {
    dishes = await getDishes();
  } catch (err) {
    error = err.message;
  }

  const taulaRaw = Number(searchParams?.taula);
  const tableNumber = Number.isInteger(taulaRaw) && taulaRaw >= 1 && taulaRaw <= 100 ? taulaRaw : null;

  return (
    <main className="bg-white">
      <PageHero caption="Castellcir" subtitle="Tria els teus plats i personalitza’ls." />

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

        {!error && dishes.length > 0 && <MenuExplorer dishes={dishes} tableNumber={tableNumber} />}

        <Footer />
      </div>
    </main>
  );
}
