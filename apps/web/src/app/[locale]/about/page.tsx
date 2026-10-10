import {useTranslations} from 'next-intl';

export default function About() {
  const t = useTranslations('about');
  
  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-900 to-blue-950 text-white py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute top-40 -left-20 w-72 h-72 bg-blue-400 rounded-full blur-3xl opacity-20"></div>
        </div>
        
        <div className="max-w-5xl mx-auto px-4 relative z-10 text-center">
          <div className="inline-block px-4 py-1.5 rounded-full bg-blue-800/50 border border-blue-700/50 text-blue-200 text-sm font-medium mb-6 backdrop-blur-sm">
            {t('title')}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight leading-tight">
            Empowering Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Language Journey</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100/90 leading-relaxed max-w-3xl mx-auto">
            {t('description')}
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-6xl mx-auto px-4 -mt-12 relative z-20 mb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 bg-white p-8 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">10k+</div>
            <div className="text-sm text-gray-500 font-medium">Students</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">50+</div>
            <div className="text-sm text-gray-500 font-medium">Native Tutors</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">95%</div>
            <div className="text-sm text-gray-500 font-medium">Pass Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">24/7</div>
            <div className="text-sm text-gray-500 font-medium">Support</div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900">Our Vision for the Future</h2>
          <p className="text-gray-600 leading-relaxed text-lg">
            We believe that learning a language should be an inspiring and transformative experience. Our academy was founded on the principle of providing accessible, high-quality German education to everyone, everywhere.
          </p>
          <p className="text-gray-600 leading-relaxed text-lg">
            Through innovative teaching methods, state-of-the-art technology, and a deep understanding of language acquisition, we bridge the gap between students and their goals—whether that's studying at a top German university, advancing in a global career, or simply connecting with a new culture.
          </p>
          <div className="pt-4">
            <button className="bg-blue-50 text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-100 transition-colors">
              Join Our Community
            </button>
          </div>
        </div>
        <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-cyan-400"></div>
          <div className="absolute inset-0 flex items-center justify-center text-white/90 text-2xl font-medium">
            German Academy
          </div>
        </div>
      </div>
    </div>
  );
}
