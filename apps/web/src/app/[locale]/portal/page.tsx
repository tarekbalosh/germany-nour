import { getTranslations } from 'next-intl/server';

export default async function StudentPortalPage() {
  const t = await getTranslations('Index'); // Fallback to index if no portal translations
  // Without actual auth, we cannot fetch data here easily on server without a hardcoded ID.
  // This is a UI skeleton mapping Phase 8 requirements.

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Student Portal</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="bg-white shadow p-6 rounded">
          <h2 className="text-xl font-bold mb-4">My Materials</h2>
          <p className="text-gray-600">Please log in to view your learning materials.</p>
        </section>
        
        <section className="bg-white shadow p-6 rounded">
          <h2 className="text-xl font-bold mb-4">My Progress</h2>
          <p className="text-gray-600">Please log in to view tutor feedback and progress.</p>
        </section>
      </div>
    </div>
  );
}
