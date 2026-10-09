import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

async function getCourses() {
  try {
    const res = await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') + '/api/v1/courses', { cache: 'no-store' });
    if (!res.ok) return [];
    return await res.json();
  } catch (e) {
    return [];
  }
}

export default async function CoursesPage() {
  const t = await getTranslations('Courses');
  const courses = await getCourses();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{t('title')}</h1>
      {courses.length === 0 ? (
        <p>No courses available at the moment.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((c: any) => (
            <li key={c.id} className="border p-4 rounded shadow">
              <h2 className="text-xl font-semibold mb-2">{c.title}</h2>
              <p className="text-gray-600 mb-2">{c.level} - {c.durationWeeks} Weeks</p>
              <p className="font-bold text-lg text-blue-600 mb-4">€{c.price}</p>
              <Link href={`/courses/${c.id}`} className="bg-blue-600 text-white px-4 py-2 rounded">
                View Details
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
