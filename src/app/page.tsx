import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ContactModal } from '@/components/ContactModal'
import { ShieldCheck, Activity, Search, Bone } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />

      <main className="flex-1">
        {/* HERO SECTION WITH CLINIC BACKGROUND AND SUBTLE GRADIENT */}
        <section className="relative flex items-center min-h-[480px] sm:min-h-[600px] lg:min-h-[700px]">
          {/* Background Image */}
          <div
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2000&auto=format&fit=crop')` }}
          />
          {/* Subtle Gradient Overlay */}
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#0F2044]/97 via-[#0F2044]/85 to-[#0F2044]/40 sm:to-transparent" />

          <div className="container relative z-20 mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl py-16 sm:py-0">
            <div className="max-w-2xl space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-semibold tracking-wide uppercase">
                <ShieldCheck className="w-4 h-4 text-[#2C6E9E]" /> Servicios Ocupacionales de Excelencia
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Confianza y precisión en la evaluación médica de su personal.
              </h1>

              <p className="text-lg text-slate-200 leading-relaxed max-w-lg font-light">
                Plataforma y clínica integral para exámenes de admisión, valoraciones periódicas y control toxicológico. Proveemos infraestructura médica de vanguardia para su empresa.
              </p>

              <div className="pt-4">
                <ContactModal>
                  <button className="bg-[#2C6E9E] hover:bg-[#2C6E9E]/90 text-white h-12 sm:h-14 px-6 sm:px-8 rounded-md font-medium text-base sm:text-lg transition-colors inline-flex items-center justify-center shadow-lg hover:shadow-xl w-full sm:w-auto">
                    Agendar Evaluación Empresarial
                  </button>
                </ContactModal>
              </div>
            </div>
          </div>
        </section>

        {/* SERVICES SECTION WITH BACKGROUND IMAGE CARDS */}
        <section id="servicios" className="py-20 lg:py-28 bg-[#F8F9FB]">
          <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <h2 className="text-3xl lg:text-4xl font-bold text-[#0F2044] mb-4 tracking-tight">Especialidades Clínicas Integrales</h2>
              <p className="text-slate-600 text-lg">
                Disponemos de unidades médicas especializadas para certificar la competencia física y toxicológica de sus colaboradores con absoluta precisión.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
              {/* Card 1: Exámenes Periódicos */}
              <div className="group relative rounded-2xl overflow-hidden aspect-[5/4] sm:aspect-[4/5] shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url('https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1000&auto=format&fit=crop')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F2044]/95 via-[#0F2044]/60 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col items-center text-center">
                  <div className="bg-white/10 backdrop-blur-md w-14 h-14 rounded-full flex items-center justify-center mb-6 border border-white/20">
                    <Activity className="h-7 w-7 text-white" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-3">Exámenes Periódicos y de Ingreso</h3>
                  <p className="text-slate-200 text-sm leading-relaxed font-light">
                    Evaluaciones físicas exhaustivas dictaminadas por médicos especialistas para asegurar la aptitud de su capital humano.
                  </p>
                </div>
              </div>

              {/* Card 2: Antidoping & Laboratorio */}
              <div className="group relative rounded-2xl overflow-hidden aspect-[5/4] sm:aspect-[4/5] shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url('/images/doping.jpg')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F2044]/95 via-[#0F2044]/60 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col items-center text-center">
                  <div className="bg-white/10 backdrop-blur-md w-14 h-14 rounded-full flex items-center justify-center mb-6 border border-white/20">
                    <Search className="h-7 w-7 text-white" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-3">Servicios<br />Antidoping</h3>
                  <p className="text-slate-200 text-sm leading-relaxed font-light">
                    Análisis de laboratorio de alta especificidad mediante reactivos de drogas y perfil toxicológico confidencial estructurado.
                  </p>
                </div>
              </div>

              {/* Card 3: Rayos X */}
              <div className="group relative rounded-2xl overflow-hidden aspect-[5/4] sm:aspect-[4/5] shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url('https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?q=80&w=1000&auto=format&fit=crop')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F2044]/95 via-[#0F2044]/60 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col items-center text-center">
                  <div className="bg-white/10 backdrop-blur-md w-14 h-14 rounded-full flex items-center justify-center mb-6 border border-white/20">
                    <Bone className="h-7 w-7 text-white" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-3">Imágenes Clínicas Rayos X</h3>
                  <p className="text-slate-200 text-sm leading-relaxed font-light">
                    Estudios de radiografía digitalizados de precisión extrema para evaluación musculoesquelética profunda del trabajador.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
