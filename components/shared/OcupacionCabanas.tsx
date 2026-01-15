'use client'

import { useState, useEffect, useCallback } from 'react'
import { Calendar, Home } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Reserva {
    _id: string
    nombreCompleto: string
    numeroCabana: '1' | '2'
    origenReserva: string
    fechaInicio: string
    fechaFin: string
    cantidadDias: number
    costoTotal: number
    sena: number
    saldoPendiente: number
    costoTotalUSD: number
}

export default function OcupacionCabanas() {
    const [fecha, setFecha] = useState<Date>(new Date())
    const [reservas, setReservas] = useState<Reserva[]>([])
    const [loading, setLoading] = useState(true)
    const [isTransitioning, setIsTransitioning] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchReservas = useCallback(async () => {
        try {
            // Solo mostrar loading completo en la carga inicial
            if (loading) {
                setLoading(true)
            } else {
                setIsTransitioning(true)
            }
            setError(null)
            const fechaStr = fecha.toISOString().split('T')[0]
            const response = await fetch(`/api/reservas/dia?fecha=${fechaStr}`)
            const data = await response.json()

            if (data.success) {
                setReservas(data.data)
            } else {
                setError(data.message)
            }
        } catch (err) {
            setError('Error al cargar las reservas')
            console.error(err)
        } finally {
            setLoading(false)
            setIsTransitioning(false)
        }
    }, [fecha, loading])

    useEffect(() => {
        fetchReservas()
    }, [fetchReservas])

    const irHoy = () => {
        setFecha(new Date())
    }

    const cambiarFecha = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value) {
            const [year, month, day] = e.target.value.split('-').map(Number)
            const nuevaFecha = new Date(year, month - 1, day)

            // No permitir fechas pasadas
            const hoy = new Date()
            hoy.setHours(0, 0, 0, 0)
            nuevaFecha.setHours(0, 0, 0, 0)

            if (nuevaFecha >= hoy) {
                setFecha(nuevaFecha)
            }
        }
    }

    const fechaFormateada = fecha.toLocaleDateString('es-AR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

    const esHoy = fecha.toDateString() === new Date().toDateString()

    // Obtener fecha en formato YYYY-MM-DD para el input
    const fechaInputValue = new Date(fecha.getTime() - fecha.getTimezoneOffset() * 60000)
        .toISOString()
        .split('T')[0]

    // Fecha mínima (hoy)
    const minFecha = new Date().toISOString().split('T')[0]

    return (
        <Card className="w-full shadow-xl border-stone-200">
            <CardHeader className="space-y-2 bg-linear-to-br from-amber-50 to-stone-100 border-b border-stone-200">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl font-bold text-stone-800 flex items-center gap-2">
                        <Calendar className="h-6 w-6 text-amber-600" />
                        Ocupación de Cabañas
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        <Input
                            type="date"
                            value={fechaInputValue}
                            onChange={cambiarFecha}
                            min={minFecha}
                            className="w-auto border-stone-300 focus:border-amber-500 cursor-pointer"
                        />
                        {!esHoy && (
                            <Button
                                onClick={irHoy}
                                variant="outline"
                                size="sm"
                                className="border-amber-300 text-amber-700 hover:bg-amber-50 cursor-pointer"
                            >
                                <Home className="h-4 w-4 mr-2" />
                                Hoy
                            </Button>
                        )}
                    </div>
                </div>

                {/* Fecha formateada centrada */}
                <div className="text-center pt-2">
                    <p className="text-stone-700 font-semibold capitalize">{fechaFormateada}</p>
                    {esHoy && (
                        <span className="inline-block px-2 py-1 text-xs bg-amber-100 text-amber-700 rounded-full mt-1">
                            Hoy
                        </span>
                    )}
                </div>
            </CardHeader>

            <CardContent className="pt-6">
                {loading ? (
                    <div className="text-center py-8 text-stone-500">
                        <div className="animate-pulse">Cargando reservas...</div>
                    </div>
                ) : (
                    <div
                        className="transition-opacity duration-300"
                        style={{ opacity: isTransitioning ? 0.5 : 1 }}
                    >
                        {error ? (
                            <div className="text-center py-8 text-red-600">
                                <p>{error}</p>
                            </div>
                        ) : reservas.length === 0 ? (
                            <div className="text-center py-12 text-stone-500">
                                <Calendar className="h-12 w-12 mx-auto mb-4 text-stone-300" />
                                <p className="text-lg font-medium">No hay reservas para este día</p>
                                <p className="text-sm mt-1">Las cabañas están disponibles</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {reservas.map(reserva => {
                                    const fechaInicioDate = new Date(reserva.fechaInicio)
                                    const fechaFinDate = new Date(reserva.fechaFin)
                                    const esCheckIn =
                                        fecha.toDateString() === fechaInicioDate.toDateString()
                                    const esCheckOut =
                                        fecha.toDateString() === fechaFinDate.toDateString()

                                    return (
                                        <div
                                            key={reserva._id}
                                            className="p-4 border border-stone-200 rounded-lg hover:shadow-md transition-shadow bg-white"
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <h3 className="font-bold text-lg text-stone-800">
                                                        {reserva.nombreCompleto}
                                                    </h3>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-stone-700 text-white text-xs rounded-full">
                                                            <Home className="h-3 w-3" />
                                                            Cabaña {reserva.numeroCabana}
                                                        </span>
                                                        <span className="inline-flex items-center px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">
                                                            {reserva.origenReserva}
                                                        </span>
                                                    </div>
                                                </div>

                                                {(esCheckIn || esCheckOut) && (
                                                    <div className="flex flex-col gap-1">
                                                        {esCheckIn && (
                                                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                                                                CHECK-IN
                                                            </span>
                                                        )}
                                                        {esCheckOut && (
                                                            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded">
                                                                CHECK-OUT
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-2 gap-3 text-sm">
                                                <div>
                                                    <span className="text-stone-600">Estadía:</span>
                                                    <p className="font-semibold text-stone-800">
                                                        {new Date(
                                                            reserva.fechaInicio
                                                        ).toLocaleDateString('es-AR')}{' '}
                                                        -{' '}
                                                        {new Date(
                                                            reserva.fechaFin
                                                        ).toLocaleDateString('es-AR')}
                                                    </p>
                                                    <p className="text-stone-500 text-xs">
                                                        {reserva.cantidadDias} días
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className="text-stone-600">Total:</span>
                                                    <p className="font-semibold text-stone-800">
                                                        $
                                                        {reserva.costoTotal.toLocaleString('es-AR')}
                                                    </p>
                                                    <p className="text-green-600 text-xs">
                                                        ~$
                                                        {reserva.costoTotalUSD.toLocaleString(
                                                            'en-US'
                                                        )}{' '}
                                                        USD
                                                    </p>
                                                </div>
                                            </div>

                                            {reserva.saldoPendiente > 0 && (
                                                <div className="mt-3 pt-3 border-t border-stone-200">
                                                    <div className="flex justify-between items-center text-sm">
                                                        <span className="text-stone-600">
                                                            Saldo pendiente:
                                                        </span>
                                                        <span className="font-bold text-red-600">
                                                            $
                                                            {reserva.saldoPendiente.toLocaleString(
                                                                'es-AR'
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}

                                {/* Resumen del día */}
                                <div className="mt-6 p-4 bg-stone-50 border border-stone-200 rounded-lg">
                                    <h4 className="font-semibold text-stone-700 mb-2">
                                        Resumen del día
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-stone-600">Total reservas:</span>
                                            <p className="font-bold text-stone-800 text-lg">
                                                {reservas.length}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-stone-600">
                                                Cabañas ocupadas:
                                            </span>
                                            <p className="font-bold text-stone-800 text-lg">
                                                {new Set(reservas.map(r => r.numeroCabana)).size} /
                                                2
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
