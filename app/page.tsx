'use client'

import ReservaForm from '@/components/forms/ReservaForm'
import DolarDisplay from '@/components/shared/DolarDisplay'
import OcupacionCabanas from '@/components/shared/OcupacionCabanas'
import UltimasReservas from '@/components/shared/UltimasReservas'

export default function Home() {
    return (
        <main className="min-h-screen bg-linear-to-br from-stone-100 via-stone-50 to-amber-50">
            {/* Header con imagen de fondo simulada */}
            <div className="relative bg-linear-to-r from-stone-800 to-stone-700 text-white py-16 px-4 shadow-lg">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDE0aDI0djI0SDM2ek0wIDM2aDE2djE2SDB6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
                        🏡 Cabañas Los Manzanos
                    </h1>
                    <p className="text-xl md:text-2xl text-stone-200 font-light">
                        San Martín de los Andes, Neuquén
                    </p>
                    <div className="mt-6 flex items-center justify-center gap-2 text-amber-300">
                        <span className="text-2xl">★★★★★</span>
                        <span className="text-lg font-semibold">9.9/10</span>
                        <span className="text-stone-300">
                            · Booking Traveller Review Awards 2025
                        </span>
                    </div>
                </div>

                {/* Display del dólar en esquina superior derecha */}
                <div className="absolute top-4 right-4 w-64 z-20">
                    <DolarDisplay />
                </div>
            </div>

            {/* Contenedor del formulario */}
            <div className="px-4 py-12">
                <div className="mb-8 text-center max-w-7xl mx-auto">
                    <p className="text-stone-600 text-lg max-w-2xl mx-auto">
                        Completá el formulario para registrar una nueva reserva. Se enviará
                        automáticamente un email de confirmación con todos los detalles.
                    </p>
                </div>
            </div>

            <ReservaForm />

            <div className="px-4">
                {/* Secciones: Últimas Reservas y Ocupación - lado a lado en desktop */}
                <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
                    <div className="ultimas-reservas-section">
                        <UltimasReservas />
                    </div>
                    <div>
                        <OcupacionCabanas />
                    </div>
                </div>

                {/* Info adicional */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
                    <div className="bg-white p-6 rounded-lg shadow-md border border-stone-200 text-center">
                        <div className="text-3xl mb-2">📧</div>
                        <h3 className="font-semibold text-stone-800 mb-2">Email Automático</h3>
                        <p className="text-sm text-stone-600">
                            Se envía un correo con todos los detalles de la reserva
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md border border-stone-200 text-center">
                        <div className="text-3xl mb-2">📊</div>
                        <h3 className="font-semibold text-stone-800 mb-2">Cálculos Automáticos</h3>
                        <p className="text-sm text-stone-600">
                            El sistema calcula saldos y días automáticamente
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md border border-stone-200 text-center">
                        <div className="text-3xl mb-2">🔄</div>
                        <h3 className="font-semibold text-stone-800 mb-2">Integración con n8n</h3>
                        <p className="text-sm text-stone-600">
                            Próximamente: sincronización automática con Excel
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-stone-800 text-white py-8 mt-16">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-stone-300">
                        © {new Date().getFullYear()} Cabañas Los Manzanos · Sistema de Gestión de
                        Reservas
                    </p>
                    <p className="text-stone-400 text-sm mt-2">
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
