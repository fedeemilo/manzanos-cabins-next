'use client'

import ReservaForm from '@/components/forms/ReservaForm'

export default function Home() {
    return (
        <main className="min-h-screen bg-linear-to-br from-stone-100 via-stone-50 to-amber-50">
            {/* Header con imagen de fondo */}
            <div className="relative bg-linear-to-r from-stone-800 to-stone-700 text-white py-12 md:py-16 px-4 shadow-lg">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDE0aDI0djI0SDM2ek0wIDM2aDE2djE2SDB6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 tracking-tight">
                        🏡 Cabañas Los Manzanos
                    </h1>
                    <p className="text-lg md:text-xl lg:text-2xl text-stone-200 font-light mb-4">
                        San Martín de los Andes, Neuquén
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-amber-300">
                        <span className="text-xl md:text-2xl">★★★★★</span>
                        <span className="text-base md:text-lg font-semibold">9.9/10</span>
                        <span className="text-sm md:text-base text-stone-300">
                            · Booking Traveller Review Awards 2025
                        </span>
                    </div>
                </div>
            </div>

            {/* Descripción */}
            <div className="px-4 py-8 md:py-12">
                <div className="mb-6 md:mb-8 text-center max-w-7xl mx-auto">
                    <p className="text-stone-600 text-base md:text-lg max-w-2xl mx-auto">
                        Completá el formulario para registrar una nueva reserva. Se enviará
                        automáticamente un email de confirmación con todos los detalles.
                    </p>
                </div>

                <ReservaForm />
            </div>

            {/* Footer */}
            <footer className="bg-stone-800 text-white py-8 mt-16">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-stone-300 text-sm md:text-base">
                        © {new Date().getFullYear()} Cabañas Los Manzanos · Sistema de Gestión de
                        Reservas
                    </p>
                    <p className="text-stone-400 text-xs md:text-sm mt-2">
                        Desarrollado con ❤️ por{' '}
                        <a
                            href="https://fedmilo.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-stone-400 hover:text-white font-medium transition-colors"
                        >
                            fedmilo
                        </a>
                    </p>
                </div>
            </footer>
        </main>
    )
}
