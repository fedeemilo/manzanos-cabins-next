'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Calendar, MapPin, User, Home, DollarSign, CheckCircle2, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Reserva {
    _id: string
    nombreCompleto: string
    telefono?: string
    numeroCabana: string
    origenReserva: string
    fechaInicio: string
    fechaFin: string
    cantidadDias: number
    costoTotal: number
    costoTotalUSD: number
    cotizacionDolar: number
    sena: number
    saldoPendiente: number
    estadoPago: string
}

export default function ReservaPublicaPage() {
    const params = useParams()
    const [reserva, setReserva] = useState<Reserva | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchReserva = async () => {
            try {
                const response = await fetch(`/api/reservas/public/${params.id}`)
                const data = await response.json()

                if (!data.success) {
                    setError('Reserva no encontrada')
                    return
                }

                setReserva(data.data)
            } catch (err) {
                console.error(err)
                setError('Error al cargar la reserva')
            } finally {
                setLoading(false)
            }
        }

        fetchReserva()
    }, [params.id])

    if (loading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-stone-100 via-stone-50 to-amber-50 flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-stone-600" />
            </div>
        )
    }

    if (error || !reserva) {
        return (
            <div className="min-h-screen bg-linear-to-br from-stone-100 via-stone-50 to-amber-50 flex items-center justify-center p-4">
                <Card className="max-w-md w-full">
                    <CardContent className="pt-6 text-center">
                        <p className="text-red-600 text-lg font-semibold">{error}</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const fechaInicio = new Date(reserva.fechaInicio)
    const fechaFin = new Date(reserva.fechaFin)

    return (
        <div className="min-h-screen bg-linear-to-br from-stone-100 via-stone-50 to-amber-50 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-stone-800 mb-2">
                        Cabañas Los Manzanos
                    </h1>
                    <p className="text-stone-600 flex items-center justify-center gap-2">
                        <MapPin className="h-4 w-4" />
                        San Martín de los Andes, Neuquén
                    </p>
                </div>

                {/* Card Principal */}
                <Card className="shadow-xl border-stone-200 mb-6">
                    <CardHeader className="bg-linear-to-br from-stone-50 to-stone-100 border-b border-stone-200">
                        <CardTitle className="text-2xl font-bold text-stone-800 flex items-center gap-2">
                            <CheckCircle2 className="h-6 w-6 text-green-600" />
                            Reserva Confirmada
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="pt-6 space-y-6">
                        {/* Información del Huésped */}
                        <div className="space-y-3">
                            <h3 className="font-semibold text-stone-700 text-lg border-b border-stone-200 pb-2">
                                Información del Huésped
                            </h3>
                            <div className="flex items-center gap-3 text-stone-700">
                                <User className="h-5 w-5 text-stone-500" />
                                <span className="font-medium">{reserva.nombreCompleto}</span>
                            </div>
                            {reserva.telefono && (
                                <div className="flex items-center gap-3 text-stone-700">
                                    <span className="text-sm">📱 {reserva.telefono}</span>
                                </div>
                            )}
                        </div>

                        {/* Detalles de la Reserva */}
                        <div className="space-y-3">
                            <h3 className="font-semibold text-stone-700 text-lg border-b border-stone-200 pb-2">
                                Detalles de la Estadía
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3">
                                    <Home className="h-5 w-5 text-stone-500" />
                                    <div>
                                        <p className="text-sm text-stone-600">Cabaña</p>
                                        <p className="font-semibold text-stone-800">
                                            Cabaña {reserva.numeroCabana}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-5 w-5 text-stone-500" />
                                    <div>
                                        <p className="text-sm text-stone-600">Duración</p>
                                        <p className="font-semibold text-stone-800">
                                            {reserva.cantidadDias} días
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
                                <div className="flex items-center gap-2 text-amber-800 mb-2">
                                    <Calendar className="h-5 w-5" />
                                    <span className="font-semibold">Fechas de Estadía</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <p className="text-amber-700 font-medium">Entrada</p>
                                        <p className="text-amber-900 font-bold">
                                            {format(fechaInicio, "EEEE d 'de' MMMM, yyyy", {
                                                locale: es
                                            })}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-amber-700 font-medium">Salida</p>
                                        <p className="text-amber-900 font-bold">
                                            {format(fechaFin, "EEEE d 'de' MMMM, yyyy", {
                                                locale: es
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Información Financiera */}
                        <div className="space-y-3">
                            <h3 className="font-semibold text-stone-700 text-lg border-b border-stone-200 pb-2 flex items-center gap-2">
                                <DollarSign className="h-5 w-5" />
                                Información de Pago
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-stone-600">Costo Total (ARS)</span>
                                    <span className="font-bold text-stone-800 text-lg">
                                        ${reserva.costoTotal.toLocaleString('es-AR')}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-stone-600">Costo Total (USD)</span>
                                    <span className="font-semibold text-green-700">
                                        ${reserva.costoTotalUSD.toLocaleString('es-AR')}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-stone-500">Cotización Dólar Blue</span>
                                    <span className="text-stone-600">
                                        ${reserva.cotizacionDolar.toLocaleString('es-AR')}
                                    </span>
                                </div>

                                <div className="border-t border-stone-200 pt-3 mt-3">
                                    <div className="flex justify-between items-center text-green-700">
                                        <span className="font-medium">Seña Recibida</span>
                                        <span className="font-bold">
                                            ${reserva.sena.toLocaleString('es-AR')}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-red-700 mt-2">
                                        <span className="font-medium">Saldo Pendiente</span>
                                        <span className="font-bold text-xl">
                                            ${reserva.saldoPendiente.toLocaleString('es-AR')}
                                        </span>
                                    </div>
                                </div>

                                {reserva.estadoPago === 'pagado' && (
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-3">
                                        <div className="flex items-center gap-2 text-green-800">
                                            <CheckCircle2 className="h-5 w-5" />
                                            <span className="font-semibold">
                                                ¡Reserva totalmente pagada!
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Origen */}
                        <div className="text-sm text-stone-500 text-center pt-4 border-t border-stone-200">
                            Reserva realizada vía: <span className="font-medium text-stone-700">{reserva.origenReserva}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Footer */}
                <div className="text-center text-stone-600 text-sm">
                    <p>¡Esperamos que disfrutes tu estadía en Cabañas Los Manzanos!</p>
                    <p className="mt-2">San Martín de los Andes • Neuquén • Argentina</p>
                </div>
            </div>
        </div>
    )
}
