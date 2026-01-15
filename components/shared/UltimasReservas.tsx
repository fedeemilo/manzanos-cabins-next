'use client'

import { useState, useEffect } from 'react'
import { FileText, Home, Check, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

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
    estadoPago: 'pendiente' | 'pagado'
    createdAt: string
}

type FiltroTipo = 'hoy' | 'semana' | 'todas'

export default function UltimasReservas() {
    const [reservas, setReservas] = useState<Reserva[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [filtro, setFiltro] = useState<FiltroTipo>('hoy')
    const [actualizando, setActualizando] = useState<string | null>(null)

    useEffect(() => {
        fetchReservas()
    }, [])

    const fetchReservas = async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await fetch('/api/reservas?limit=50')
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
        }
    }

    const marcarComoPagado = async (id: string) => {
        try {
            setActualizando(id)
            const response = await fetch(`/api/reservas/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ estadoPago: 'pagado' })
            })

            const data = await response.json()

            if (data.success) {
                // Actualizar la lista local
                setReservas(prev =>
                    prev.map(r => (r._id === id ? { ...r, estadoPago: 'pagado' as const } : r))
                )
            } else {
                alert('Error al actualizar: ' + data.message)
            }
        } catch (err) {
            console.error(err)
            alert('Error al actualizar el estado de pago')
        } finally {
            setActualizando(null)
        }
    }

    const reservasFiltradas = reservas.filter(reserva => {
        const fechaCreacion = new Date(reserva.createdAt)
        const hoy = new Date()
        hoy.setHours(0, 0, 0, 0)

        if (filtro === 'hoy') {
            const fechaReserva = new Date(fechaCreacion)
            fechaReserva.setHours(0, 0, 0, 0)
            return fechaReserva.getTime() === hoy.getTime()
        } else if (filtro === 'semana') {
            const hace7Dias = new Date(hoy)
            hace7Dias.setDate(hace7Dias.getDate() - 7)
            return fechaCreacion >= hace7Dias
        }
        return true // 'todas'
    })

    return (
        <Card className="w-full shadow-xl border-stone-200">
            <CardHeader className="space-y-2 bg-linear-to-br from-stone-50 to-stone-100 border-b border-stone-200">
                <CardTitle className="text-2xl font-bold text-stone-800 flex items-center gap-2">
                    <FileText className="h-6 w-6 text-stone-600" />
                    Últimas Reservas Registradas
                </CardTitle>

                {/* Filtros */}
                <div className="flex gap-2">
                    <Button
                        onClick={() => setFiltro('hoy')}
                        variant={filtro === 'hoy' ? 'default' : 'outline'}
                        size="sm"
                        className={
                            filtro === 'hoy'
                                ? 'bg-stone-700 hover:bg-stone-800 text-white cursor-pointer'
                                : 'cursor-pointer'
                        }
                    >
                        Hoy
                    </Button>
                    <Button
                        onClick={() => setFiltro('semana')}
                        variant={filtro === 'semana' ? 'default' : 'outline'}
                        size="sm"
                        className={
                            filtro === 'semana'
                                ? 'bg-stone-700 hover:bg-stone-800 text-white cursor-pointer'
                                : 'cursor-pointer'
                        }
                    >
                        Esta Semana
                    </Button>
                    <Button
                        onClick={() => setFiltro('todas')}
                        variant={filtro === 'todas' ? 'default' : 'outline'}
                        size="sm"
                        className={
                            filtro === 'todas'
                                ? 'bg-stone-700 hover:bg-stone-800 text-white cursor-pointer'
                                : 'cursor-pointer'
                        }
                    >
                        Todas
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="pt-6">
                {loading ? (
                    <div className="text-center py-8 text-stone-500">
                        <div className="animate-pulse">Cargando reservas...</div>
                    </div>
                ) : error ? (
                    <div className="text-center py-8 text-red-600">
                        <p>{error}</p>
                    </div>
                ) : reservasFiltradas.length === 0 ? (
                    <div className="text-center py-12 text-stone-500">
                        <FileText className="h-12 w-12 mx-auto mb-4 text-stone-300" />
                        <p className="text-lg font-medium">No hay reservas registradas</p>
                        <p className="text-sm mt-1">
                            {filtro === 'hoy'
                                ? 'Aún no se registraron reservas hoy'
                                : filtro === 'semana'
                                ? 'No hay reservas en los últimos 7 días'
                                : 'No hay reservas en el sistema'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-stone-400 scrollbar-track-stone-100 hover:scrollbar-thumb-stone-500">
                        {reservasFiltradas.map(reserva => {
                            const fechaCreacion = new Date(reserva.createdAt)
                            const esPagado = reserva.estadoPago === 'pagado'

                            return (
                                <div
                                    key={reserva._id}
                                    className="p-4 border border-stone-200 rounded-lg hover:shadow-md transition-shadow bg-white"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-bold text-lg text-stone-800">
                                                    {reserva.nombreCompleto}
                                                </h3>
                                                {esPagado ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                                                        <Check className="h-3 w-3" />
                                                        Pagado
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
                                                        <Clock className="h-3 w-3" />
                                                        Pendiente
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-stone-700 text-white text-xs rounded-full">
                                                    <Home className="h-3 w-3" />
                                                    Cabaña {reserva.numeroCabana}
                                                </span>
                                                <span className="inline-flex items-center px-2 py-1 bg-stone-100 text-stone-700 text-xs rounded-full">
                                                    {reserva.origenReserva}
                                                </span>
                                            </div>
                                            <p className="text-xs text-stone-500 mt-2">
                                                Registrado: {fechaCreacion.toLocaleString('es-AR')}
                                            </p>
                                        </div>

                                        {!esPagado && reserva.saldoPendiente > 0 && (
                                            <Button
                                                onClick={() => marcarComoPagado(reserva._id)}
                                                disabled={actualizando === reserva._id}
                                                size="sm"
                                                variant="outline"
                                                className="border-stone-300 text-stone-700 hover:bg-stone-50 hover:border-stone-400 cursor-pointer transition-colors"
                                            >
                                                {actualizando === reserva._id ? (
                                                    <span className="flex items-center gap-2 text-stone-600">
                                                        <div className="animate-spin h-4 w-4 border-2 border-stone-400 border-t-transparent rounded-full" />
                                                        Actualizando...
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-2">
                                                        <Check className="h-4 w-4" />
                                                        Marcar Pagado
                                                    </span>
                                                )}
                                            </Button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <span className="text-stone-600">Estadía:</span>
                                            <p className="font-semibold text-stone-800">
                                                {new Date(reserva.fechaInicio).toLocaleDateString(
                                                    'es-AR'
                                                )}{' '}
                                                -{' '}
                                                {new Date(reserva.fechaFin).toLocaleDateString(
                                                    'es-AR'
                                                )}
                                            </p>
                                            <p className="text-stone-500 text-xs">
                                                {reserva.cantidadDias} días
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-stone-600">Total:</span>
                                            <p className="font-semibold text-stone-800">
                                                ${reserva.costoTotal.toLocaleString('es-AR')}
                                            </p>
                                            <p className="text-green-600 text-xs">
                                                ~${reserva.costoTotalUSD.toLocaleString('en-US')}{' '}
                                                USD
                                            </p>
                                        </div>
                                    </div>

                                    {reserva.saldoPendiente > 0 && (
                                        <div className="mt-3 pt-3 border-t border-stone-200">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-stone-600">
                                                    Seña: ${reserva.sena.toLocaleString('es-AR')}
                                                </span>
                                                <span
                                                    className={`font-bold ${
                                                        esPagado ? 'text-green-600' : 'text-red-600'
                                                    }`}
                                                >
                                                    Saldo: $
                                                    {reserva.saldoPendiente.toLocaleString('es-AR')}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        })}

                        {/* Resumen */}
                        <div className="mt-6 p-4 bg-stone-50 border border-stone-200 rounded-lg">
                            <h4 className="font-semibold text-stone-700 mb-2">Resumen</h4>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                    <span className="text-stone-600">Total:</span>
                                    <p className="font-bold text-stone-800 text-lg">
                                        {reservasFiltradas.length}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-stone-600">Pagadas:</span>
                                    <p className="font-bold text-green-600 text-lg">
                                        {
                                            reservasFiltradas.filter(r => r.estadoPago === 'pagado')
                                                .length
                                        }
                                    </p>
                                </div>
                                <div>
                                    <span className="text-stone-600">Pendientes:</span>
                                    <p className="font-bold text-amber-600 text-lg">
                                        {
                                            reservasFiltradas.filter(
                                                r => r.estadoPago === 'pendiente'
                                            ).length
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
