import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { BookOpen, Monitor, Code, Camera, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-primary p-2 rounded-lg">
                <BookOpen className="text-white w-6 h-6" />
              </div>
              <span className="text-xl font-bold text-gray-900">SMK Prima Unggul</span>
            </div>
            <Link 
              to="/login" 
              className="bg-primary text-white px-6 py-2 rounded-full font-medium hover:bg-red-800 transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left"
            >
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Membangun Masa Depan</span>
                <span className="block text-primary">Bersama SMK Prima Unggul</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                Sekolah Menengah Kejuruan yang berfokus pada pengembangan karakter dan keahlian teknologi informasi untuk menghadapi tantangan industri 4.0.
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                <Link 
                  to="/login" 
                  className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-red-800 md:py-4 md:text-lg md:px-10 shadow-lg shadow-red-200"
                >
                  Mulai Absensi <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center"
            >
              <div className="relative mx-auto w-full rounded-lg shadow-2xl overflow-hidden">
                <img
                  className="w-full"
                  src="https://picsum.photos/seed/school/800/600"
                  alt="SMK Prima Unggul"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Jurusan Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Program Keahlian Kami
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Pilih jurusan yang sesuai dengan minat dan bakatmu.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* TKJ */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
            >
              <div className="bg-amber-100 p-3 rounded-xl w-fit mb-6">
                <Monitor className="text-secondary w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">TKJ</h3>
              <p className="text-gray-600">
                Teknik Komputer dan Jaringan fokus pada infrastruktur IT, perakitan komputer, dan administrasi server.
              </p>
            </motion.div>

            {/* RPL */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
            >
              <div className="bg-red-100 p-3 rounded-xl w-fit mb-6">
                <Code className="text-primary w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">RPL</h3>
              <p className="text-gray-600">
                Rekayasa Perangkat Lunak mempelajari pembuatan aplikasi web, mobile, dan pengembangan software modern.
              </p>
            </motion.div>

            {/* Multimedia */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
            >
              <div className="bg-blue-100 p-3 rounded-xl w-fit mb-6">
                <Camera className="text-blue-600 w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Multimedia</h3>
              <p className="text-gray-600">
                Multimedia berfokus pada desain grafis, videografi, animasi, dan pengembangan konten kreatif digital.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <BookOpen className="text-secondary w-8 h-8" />
            <span className="text-2xl font-bold">SMK Prima Unggul</span>
          </div>
          <p className="text-gray-400 mb-8">
            Jl. Pendidikan No. 123, Kota Cerdas, Indonesia
          </p>
          <div className="border-t border-gray-800 pt-8">
            <p className="text-gray-500">&copy; 2026 SMK Prima Unggul. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
