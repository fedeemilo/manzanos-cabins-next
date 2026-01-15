'use client'

import UltimasReservas from '@/components/shared/UltimasReservas'
import OcupacionCabanas from '@/components/shared/OcupacionCabanas'

export default function GestionPage() {
    return (
        <main className="min-h-screen bg-linear-to-br from-stone-100 via-stone-50 to-amber-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-stone-800 mb-2">Gestión de Reservas</h1>
                    <p className="text-stone-600 text-lg">
                        Visualizá y administrá las reservas de las Cabañas Los Manzanos
                    </p>
                </div>

                {/* Grid con las dos secciones lado a lado */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="ultimas-reservas-section">
                        <UltimasReservas />
                    </div>
                    <div>
                        <OcupacionCabanas />
                    </div>
                </div>
            </div>
        </main>
    )
}
