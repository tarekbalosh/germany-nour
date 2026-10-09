import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

async function getCourse(id: string) {
  try {
    const res = await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') + `/api/v1/courses/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
}

export default async function CourseDetailPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const t = await getTranslations('Courses');
  const { id } = await params;
  const course = await getCourse(id);

  if (!course) return notFound();

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
      <p className="text-gray-600 text-lg mb-2">Level: {course.level}</p>
      <p className="text-gray-600 text-lg mb-2">Duration: {course.durationWeeks} Weeks</p>
      <p className="font-bold text-2xl text-blue-600 mb-6">€{course.price}</p>
      <p className="text-gray-800 leading-relaxed">{course.description || 'No description available.'}</p>
    </div>
  );
}
