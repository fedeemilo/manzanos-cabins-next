'use client'

import { CheckCircle2, X, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface SuccessBannerProps {
    reserva: {
        nombreCompleto: string
        numeroCabana: string
        fechaInicio: Date
        fechaFin: Date
        costoTotal: number
    }
    onClose: () => void
}

export default function SuccessBanner({ reserva, onClose }: SuccessBannerProps) {
    return (
        <div className="bg-linear-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-6 shadow-lg mb-8 animate-in slide-in-from-top duration-500">
            <div className="flex items-start gap-4">
                {/* Ícono de éxito */}
                <div className="flex-shrink-0">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>

                {/* Contenido */}
                <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-green-900 mb-2">
                        ¡Reserva creada exitosamente! 🎉
                    </h3>

                    <div className="space-y-2 text-green-800">
                        <p className="flex items-center gap-2">
                            <span className="font-semibold">Huésped:</span>
                            <span>{reserva.nombreCompleto}</span>
                        </p>
                        <p className="flex items-center gap-2">
                            <span className="font-semibold">Cabaña:</span>
                            <span>Cabaña {reserva.numeroCabana}</span>
                        </p>
                        <p className="flex items-center gap-2">
                            <span className="font-semibold">Estadía:</span>
                            <span>
                                {format(reserva.fechaInicio, 'dd/MM/yyyy', { locale: es })} -{' '}
                                {format(reserva.fechaFin, 'dd/MM/yyyy', { locale: es })}
                            </span>
                        </p>
                        <p className="flex items-center gap-2">
                            <span className="font-semibold">Total:</span>
                            <span className="text-lg font-bold">
                                ${reserva.costoTotal.toLocaleString('es-AR')}
                            </span>
                        </p>
                    </div>

                    {/* Botón para ir a Gestión */}
                    <Link
                        href="/gestion"
                        className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors shadow-md"
                    >
                        Ver en Gestión
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                {/* Botón cerrar */}
                <button
                    onClick={onClose}
                    className="flex-shrink-0 text-green-600 hover:text-green-800 transition-colors p-1 rounded-lg hover:bg-green-100"
                    aria-label="Cerrar banner"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>
        </div>
    )
}
