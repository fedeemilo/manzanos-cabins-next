'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Loader2, Calculator } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { reservaSchema, ReservaFormData } from '@/lib/schemas'
import SuccessBanner from '@/components/shared/SuccessBanner'

interface ReservaCreada {
    nombreCompleto: string
    numeroCabana: string
    fechaInicio: Date
    fechaFin: Date
    costoTotal: number
}

export default function ReservaForm() {
    const [isLoading, setIsLoading] = useState(false)
    const [cotizacionDolar, setCotizacionDolar] = useState<number>(1200)
    const [tipoCosto, setTipoCosto] = useState<'porDia' | 'total'>('porDia')
    const [disponibilidadError, setDisponibilidadError] = useState('')
    const [isDesktop, setIsDesktop] = useState(false)
    const [reservaCreada, setReservaCreada] = useState<ReservaCreada | null>(null)
    const router = useRouter()

    // Detectar tamaño de pantalla
    useEffect(() => {
        const checkDesktop = () => {
            setIsDesktop(window.innerWidth >= 1024)
        }
        checkDesktop()
        window.addEventListener('resize', checkDesktop)
        return () => window.removeEventListener('resize', checkDesktop)
    }, [])

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        clearErrors,
        formState: { errors }
    } = useForm<ReservaFormData>({
        resolver: zodResolver(reservaSchema),
        mode: 'onTouched', // Validar solo cuando el usuario toca un campo
        defaultValues: {
            sena: 0,
            porcentajeDescuento: 0
        }
    })

    const fechaInicio = watch('fechaInicio')
    const fechaFin = watch('fechaFin')
    const costoTotal = watch('costoTotal')
    const costoPorDia = watch('costoPorDia')
    const porcentajeDescuento = watch('porcentajeDescuento') || 0
    const sena = watch('sena')
    const origenReserva = watch('origenReserva')
    const numeroCabana = watch('numeroCabana')

    // Calcular cantidad de días
    const cantidadDias =
        fechaInicio && fechaFin
            ? Math.ceil((fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24))
            : 0

    // Calcular costo total base según el tipo de input
    const costoTotalBase =
        tipoCosto === 'porDia' && costoPorDia && cantidadDias > 0
            ? costoPorDia * cantidadDias
            : costoTotal || 0

    // Aplicar descuento
    const montoDescuento = (costoTotalBase * porcentajeDescuento) / 100
    const costoTotalFinal = Math.round(costoTotalBase - montoDescuento)

    // Calcular saldo pendiente
    const saldoPendiente = costoTotalFinal && sena ? costoTotalFinal - sena : costoTotalFinal

    // Actualizar el campo costoTotal cuando se calcule automáticamente
    useEffect(() => {
        if (tipoCosto === 'porDia' && cantidadDias > 0 && costoPorDia && costoPorDia > 0) {
            const total = Math.round(costoPorDia * cantidadDias * (1 - porcentajeDescuento / 100))
            setValue('costoTotal', total, { shouldValidate: false })
        }
    }, [tipoCosto, cantidadDias, costoPorDia, porcentajeDescuento, setValue])

    // Calcular monto en USD
    const costoTotalUSD =
        costoTotalFinal && cotizacionDolar
            ? Math.round((costoTotalFinal / cotizacionDolar) * 100) / 100
            : 0

    // Validar disponibilidad cuando cambien fechas o cabaña
    useEffect(() => {
        const validarDisponibilidad = async () => {
            if (fechaInicio && fechaFin && numeroCabana) {
                // No mostrar loading en el botón, solo validar en silencio
                setDisponibilidadError('')

                try {
                    const fechaInicioStr = fechaInicio.toISOString().split('T')[0]
                    const fechaFinStr = fechaFin.toISOString().split('T')[0]

                    const response = await fetch(
                        `/api/reservas/disponibilidad?fechaInicio=${fechaInicioStr}&fechaFin=${fechaFinStr}&numeroCabana=${numeroCabana}`
                    )
                    const data = await response.json()

                    if (data.success && !data.disponible) {
                        setDisponibilidadError(
                            `⚠️ La Cabaña ${numeroCabana} ya está reservada en estas fechas`
                        )
                    }
                } catch (err) {
                    console.error('Error validando disponibilidad:', err)
                }
            }
        }

        // Aumentar el delay para evitar validaciones muy frecuentes
        const timeoutId = setTimeout(validarDisponibilidad, 800)
        return () => clearTimeout(timeoutId)
    }, [fechaInicio, fechaFin, numeroCabana])

    // Obtener cotización del dólar al cargar
    useEffect(() => {
        fetch('/api/dolar')
            .then(res => res.json())
            .then(data => setCotizacionDolar(data.cotizacion))
            .catch(() => setCotizacionDolar(1200))

        // Cargar datos guardados del localStorage
        const saved = localStorage.getItem('reservaFormData')
        if (saved) {
            try {
                const parsedData = JSON.parse(saved)
                Object.keys(parsedData).forEach(key => {
                    const formKey = key as keyof ReservaFormData
                    if ((formKey === 'fechaInicio' || formKey === 'fechaFin') && parsedData[key]) {
                        const dateObj = new Date(parsedData[key])
                        const localDate = new Date(
                            dateObj.getFullYear(),
                            dateObj.getMonth(),
                            dateObj.getDate()
                        )
                        setValue(formKey, localDate)
                    } else if (parsedData[key] !== null && parsedData[key] !== undefined) {
                        setValue(formKey, parsedData[key])
                    }
                })
            } catch (e) {
                console.error('Error loading saved data:', e)
            }
        }
    }, [setValue])

    // Guardar en localStorage cada vez que cambian los valores
    useEffect(() => {
        const subscription = watch(data => {
            localStorage.setItem('reservaFormData', JSON.stringify(data))
        })
        return () => subscription.unsubscribe()
    }, [watch])

    const onSubmit = async (data: ReservaFormData) => {
        // Verificar disponibilidad antes de enviar
        if (disponibilidadError) {
            toast.error('No se puede crear la reserva: la cabaña ya está ocupada en estas fechas')
            return
        }

        setIsLoading(true)

        try {
            const response = await fetch('/api/reservas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...data,
                    costoPorDia: tipoCosto === 'porDia' ? costoPorDia : undefined,
                    porcentajeDescuento: porcentajeDescuento || undefined
                })
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.message || 'Error al crear la reserva')
            }

            // Guardar reserva creada para mostrar banner
            setReservaCreada({
                nombreCompleto: data.nombreCompleto,
                numeroCabana: data.numeroCabana,
                fechaInicio: data.fechaInicio,
                fechaFin: data.fechaFin,
                costoTotal: costoTotalFinal
            })

            // Primero limpiar errores, luego resetear formulario
            clearErrors() // Limpiar todos los errores de validación
            setDisponibilidadError('') // Limpiar error de disponibilidad

            // Reset sin validar
            reset(
                {
                    sena: 0,
                    porcentajeDescuento: 0,
                    costoTotal: undefined,
                    costoPorDia: undefined,
                    nombreCompleto: '',
                    numeroCabana: undefined,
                    origenReserva: undefined,
                    fechaInicio: undefined,
                    fechaFin: undefined
                },
                {
                    keepErrors: false,
                    keepDirty: false,
                    keepIsSubmitted: false,
                    keepTouched: false,
                    keepIsValid: false,
                    keepSubmitCount: false
                }
            )
            localStorage.removeItem('reservaFormData')

            // Scroll hacia arriba para ver el banner
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            })

            // Refresh para actualizar las listas
            router.refresh()
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : 'Error al crear la reserva')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div style={{ width: '100%', maxWidth: '1600px', margin: '0 auto', padding: '0 1rem' }}>
            {/* Banner de éxito */}
            {reservaCreada && (
                <SuccessBanner reserva={reservaCreada} onClose={() => setReservaCreada(null)} />
            )}

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: isDesktop ? '2fr 1fr' : '1fr',
                    gap: '1.5rem'
                }}
            >
                {/* Columna Izquierda: Formulario */}
                <Card className="shadow-xl border-stone-200">
                    <CardHeader className="space-y-2 bg-linear-to-br from-stone-50 to-stone-100 border-b border-stone-200">
                        <CardTitle className="text-3xl font-bold text-stone-800 text-center">
                            Nueva Reserva
                        </CardTitle>
                        <CardDescription className="text-center text-stone-600">
                            Registrá los datos de la reserva para las Cabañas Los Manzanos
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-6">
                        {disponibilidadError && (
                            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
                                <p className="font-semibold">{disponibilidadError}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Nombre Completo */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="nombreCompleto"
                                    className="text-stone-700 font-medium"
                                >
                                    Nombre y Apellido del Huésped
                                </Label>
                                <Input
                                    id="nombreCompleto"
                                    placeholder="Juan Pérez"
                                    className="border-stone-300 focus:border-stone-500"
                                    {...register('nombreCompleto')}
                                />
                                {errors.nombreCompleto && (
                                    <p className="text-sm text-red-600">
                                        {errors.nombreCompleto.message}
                                    </p>
                                )}
                            </div>

                            {/* Número de Cabaña */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="numeroCabana"
                                    className="text-stone-700 font-medium"
                                >
                                    Número de Cabaña
                                </Label>
                                <Select
                                    value={numeroCabana}
                                    onValueChange={value => {
                                        setValue('numeroCabana', value as '1' | '2', {
                                            shouldValidate: true
                                        })
                                        clearErrors('numeroCabana')
                                    }}
                                >
                                    <SelectTrigger className="border-stone-300 focus:border-stone-500">
                                        <SelectValue placeholder="Seleccioná la cabaña" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Cabaña 1</SelectItem>
                                        <SelectItem value="2">Cabaña 2</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.numeroCabana && (
                                    <p className="text-sm text-red-600">
                                        {errors.numeroCabana.message}
                                    </p>
                                )}
                            </div>

                            {/* Origen de Reserva */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="origenReserva"
                                    className="text-stone-700 font-medium"
                                >
                                    Origen de la Reserva
                                </Label>
                                <Select
                                    value={origenReserva}
                                    onValueChange={value => {
                                        setValue(
                                            'origenReserva',
                                            value as 'Booking' | 'Airbnb' | 'Particular' | 'Otro',
                                            { shouldValidate: true }
                                        )
                                        clearErrors('origenReserva')
                                    }}
                                >
                                    <SelectTrigger className="border-stone-300 focus:border-stone-500">
                                        <SelectValue placeholder="Seleccioná el origen" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Booking">Booking.com</SelectItem>
                                        <SelectItem value="Airbnb">Airbnb</SelectItem>
                                        <SelectItem value="Particular">Particular</SelectItem>
                                        <SelectItem value="Otro">Otro</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.origenReserva && (
                                    <p className="text-sm text-red-600">
                                        {errors.origenReserva.message}
                                    </p>
                                )}

                                {origenReserva === 'Otro' && (
                                    <div className="mt-3 animate-in slide-in-from-top-2 duration-200">
                                        <Label
                                            htmlFor="origenReservaOtro"
                                            className="text-stone-700 font-medium text-sm"
                                        >
                                            Especifique el origen
                                        </Label>
                                        <Input
                                            id="origenReservaOtro"
                                            placeholder="Ej: Recomendación, Instagram, etc."
                                            className="border-stone-300 focus:border-stone-500 mt-1"
                                            {...register('origenReservaOtro')}
                                        />
                                        {errors.origenReservaOtro && (
                                            <p className="text-sm text-red-600 mt-1">
                                                {errors.origenReservaOtro.message}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Fechas */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="fechaInicio"
                                        className="text-stone-700 font-medium"
                                    >
                                        Fecha de Entrada
                                    </Label>
                                    <Input
                                        id="fechaInicio"
                                        type="date"
                                        className="border-stone-300 focus:border-stone-500"
                                        value={
                                            fechaInicio
                                                ? new Date(
                                                      fechaInicio.getTime() -
                                                          fechaInicio.getTimezoneOffset() * 60000
                                                  )
                                                      .toISOString()
                                                      .split('T')[0]
                                                : ''
                                        }
                                        onChange={e => {
                                            if (e.target.value) {
                                                const [year, month, day] = e.target.value
                                                    .split('-')
                                                    .map(Number)
                                                const date = new Date(year, month - 1, day)
                                                setValue('fechaInicio', date)
                                                clearErrors('fechaInicio')

                                                // Si la nueva fecha de inicio es posterior a la fecha de fin,
                                                // limpiar la fecha de fin para evitar errores
                                                if (fechaFin && date > fechaFin) {
                                                    // @ts-expect-error - Limpiando el campo de fecha
                                                    setValue('fechaFin', undefined)
                                                    clearErrors('fechaFin')
                                                }
                                            }
                                        }}
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                    {errors.fechaInicio && (
                                        <p className="text-sm text-red-600">
                                            {errors.fechaInicio.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="fechaFin"
                                        className="text-stone-700 font-medium"
                                    >
                                        Fecha de Salida
                                    </Label>
                                    <Input
                                        id="fechaFin"
                                        type="date"
                                        className="border-stone-300 focus:border-stone-500"
                                        value={
                                            fechaFin
                                                ? new Date(
                                                      fechaFin.getTime() -
                                                          fechaFin.getTimezoneOffset() * 60000
                                                  )
                                                      .toISOString()
                                                      .split('T')[0]
                                                : ''
                                        }
                                        onChange={e => {
                                            if (e.target.value) {
                                                const [year, month, day] = e.target.value
                                                    .split('-')
                                                    .map(Number)
                                                const date = new Date(year, month - 1, day)
                                                setValue('fechaFin', date)
                                            }
                                        }}
                                        min={
                                            fechaInicio
                                                ? new Date(fechaInicio.getTime() + 86400000)
                                                      .toISOString()
                                                      .split('T')[0]
                                                : new Date().toISOString().split('T')[0]
                                        }
                                    />
                                    {errors.fechaFin && (
                                        <p className="text-sm text-red-600">
                                            {errors.fechaFin.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Toggle: Costo por Día vs Costo Total */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Calculator className="h-5 w-5 text-stone-600" />
                                    <Label className="text-stone-700 font-medium">
                                        Tipo de Cálculo
                                    </Label>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        onClick={() => {
                                            setTipoCosto('porDia')
                                            // Limpiar costoTotal cuando cambiamos a "por día"
                                            setValue('costoTotal', undefined)
                                        }}
                                        variant={tipoCosto === 'porDia' ? 'default' : 'outline'}
                                        size="sm"
                                        className={
                                            tipoCosto === 'porDia'
                                                ? 'bg-stone-700 hover:bg-stone-800 text-white cursor-pointer'
                                                : 'cursor-pointer'
                                        }
                                    >
                                        Costo por Día
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={() => {
                                            setTipoCosto('total')
                                            // Limpiar costoPorDia cuando cambiamos a "total"
                                            setValue('costoPorDia', undefined)
                                        }}
                                        variant={tipoCosto === 'total' ? 'default' : 'outline'}
                                        size="sm"
                                        className={
                                            tipoCosto === 'total'
                                                ? 'bg-stone-700 hover:bg-stone-800 text-white cursor-pointer'
                                                : 'cursor-pointer'
                                        }
                                    >
                                        Costo Total
                                    </Button>
                                </div>
                            </div>

                            {/* Montos */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {tipoCosto === 'porDia' ? (
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="costoPorDia"
                                            className="text-stone-700 font-medium"
                                        >
                                            Costo por Día ($)
                                        </Label>
                                        <Input
                                            id="costoPorDia"
                                            type="number"
                                            placeholder="150000"
                                            className="border-stone-300 focus:border-stone-500"
                                            value={costoPorDia || ''}
                                            onChange={e => {
                                                const value = e.target.value
                                                setValue(
                                                    'costoPorDia',
                                                    value === '' ? undefined : Number(value)
                                                )
                                            }}
                                        />
                                        {errors.costoPorDia && (
                                            <p className="text-sm text-red-600">
                                                {errors.costoPorDia.message}
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="costoTotal"
                                            className="text-stone-700 font-medium"
                                        >
                                            Costo Total ($)
                                        </Label>
                                        <Input
                                            id="costoTotal"
                                            type="number"
                                            placeholder="100000"
                                            className="border-stone-300 focus:border-stone-500"
                                            value={costoTotal || ''}
                                            onChange={e => {
                                                const value = e.target.value
                                                setValue(
                                                    'costoTotal',
                                                    value === '' ? undefined : Number(value)
                                                )
                                            }}
                                        />
                                        {errors.costoTotal && (
                                            <p className="text-sm text-red-600">
                                                {errors.costoTotal.message}
                                            </p>
                                        )}
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="porcentajeDescuento"
                                        className="text-stone-700 font-medium"
                                    >
                                        Descuento (%){' '}
                                        <span className="text-stone-500 font-normal">
                                            (opcional)
                                        </span>
                                    </Label>
                                    <Input
                                        id="porcentajeDescuento"
                                        type="number"
                                        placeholder="0"
                                        min="0"
                                        max="100"
                                        className="border-stone-300 focus:border-stone-500"
                                        value={porcentajeDescuento || 0}
                                        onFocus={e => {
                                            // Si el valor es 0, limpiar el campo al hacer foco
                                            if (e.target.value === '0') {
                                                e.target.value = ''
                                                setValue('porcentajeDescuento', 0)
                                            }
                                        }}
                                        onBlur={e => {
                                            // Si el campo está vacío al perder foco, volver a poner 0
                                            if (e.target.value === '') {
                                                setValue('porcentajeDescuento', 0)
                                            }
                                        }}
                                        onChange={e => {
                                            const value = e.target.value
                                            setValue(
                                                'porcentajeDescuento',
                                                value === '' ? 0 : Number(value)
                                            )
                                            clearErrors('porcentajeDescuento')
                                        }}
                                    />
                                    {errors.porcentajeDescuento && (
                                        <p className="text-sm text-red-600">
                                            {errors.porcentajeDescuento.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Seña */}
                            <div className="space-y-2">
                                <Label htmlFor="sena" className="text-stone-700 font-medium">
                                    Seña Recibida ($){' '}
                                    <span className="text-stone-500 font-normal">(opcional)</span>
                                </Label>
                                <Input
                                    id="sena"
                                    type="number"
                                    className="border-stone-300 focus:border-stone-500"
                                    value={sena || 0}
                                    onFocus={e => {
                                        // Si el valor es 0, limpiar el campo al hacer foco
                                        if (e.target.value === '0') {
                                            e.target.value = ''
                                            setValue('sena', 0)
                                        }
                                    }}
                                    onBlur={e => {
                                        // Si el campo está vacío al perder foco, volver a poner 0
                                        if (e.target.value === '') {
                                            setValue('sena', 0)
                                        }
                                    }}
                                    onChange={e => {
                                        const value = e.target.value
                                        setValue('sena', value === '' ? 0 : Number(value))
                                        clearErrors('sena')
                                    }}
                                />
                                {errors.sena && (
                                    <p className="text-sm text-red-600">{errors.sena.message}</p>
                                )}
                            </div>

                            {/* Botón Submit */}
                            <Button
                                type="submit"
                                disabled={isLoading || !!disponibilidadError}
                                className="w-full bg-stone-700 hover:bg-stone-800 text-white font-semibold py-6 text-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Guardando reserva...
                                    </>
                                ) : (
                                    'Crear Reserva'
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Columna Derecha: Información Calculada (Sticky en desktop) */}
                <div className="lg:sticky lg:top-24 h-fit">
                    <Card className="shadow-xl border-stone-200">
                        <CardHeader className="bg-linear-to-br from-stone-50 to-stone-100 border-b border-stone-200">
                            <CardTitle className="text-xl font-bold text-stone-800 flex items-center gap-2">
                                <Calculator className="h-5 w-5" />
                                Resumen de Reserva
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            {cantidadDias > 0 ? (
                                <div className="space-y-4">
                                    {/* Días */}
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <p className="text-sm text-blue-700 font-medium mb-1">
                                            Cantidad de días
                                        </p>
                                        <p className="text-2xl font-bold text-blue-900">
                                            {cantidadDias} {cantidadDias === 1 ? 'día' : 'días'}
                                        </p>
                                    </div>

                                    {/* Costo Total sin descuento (solo si no hay descuento) */}
                                    {porcentajeDescuento === 0 && costoTotalFinal > 0 && (
                                        <div className="bg-linear-to-br from-stone-700 to-stone-800 border-2 border-stone-900 rounded-lg p-5 shadow-lg">
                                            <p className="text-sm text-stone-200 font-medium mb-2">
                                                Costo Total (ARS)
                                            </p>
                                            <p className="text-3xl font-bold text-white">
                                                ${costoTotalFinal.toLocaleString('es-AR')}
                                            </p>
                                        </div>
                                    )}

                                    {/* Desglose de descuento si aplica */}
                                    {porcentajeDescuento > 0 && costoTotalBase > 0 && (
                                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                            <p className="text-sm text-amber-700 font-medium mb-2">
                                                Desglose de descuento
                                            </p>
                                            <div className="space-y-1 text-sm">
                                                <div className="flex justify-between">
                                                    <span>Subtotal:</span>
                                                    <span className="font-semibold">
                                                        ${costoTotalBase.toLocaleString('es-AR')}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-amber-700">
                                                    <span>Descuento ({porcentajeDescuento}%):</span>
                                                    <span className="font-semibold">
                                                        -${montoDescuento.toLocaleString('es-AR')}
                                                    </span>
                                                </div>
                                                {/* Total destacado */}
                                                <div className="flex justify-between items-center bg-amber-600 text-white rounded-lg px-3 py-3 mt-2 shadow-md">
                                                    <span className="font-bold text-base">
                                                        Total:
                                                    </span>
                                                    <span className="font-bold text-2xl">
                                                        ${costoTotalFinal.toLocaleString('es-AR')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Costo en USD */}
                                    {costoTotalUSD > 0 && (
                                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                            <p className="text-sm text-green-700 font-medium mb-1">
                                                Costo en USD
                                            </p>
                                            <p className="text-2xl font-bold text-green-900">
                                                ${costoTotalUSD.toLocaleString('en-US')}
                                            </p>
                                            <p className="text-xs text-green-600 mt-1">
                                                Dólar blue: $
                                                {cotizacionDolar.toLocaleString('es-AR')}
                                            </p>
                                        </div>
                                    )}

                                    {/* Saldo Pendiente */}
                                    {saldoPendiente > 0 && (
                                        <div className="p-4 bg-stone-50 border border-stone-200 rounded-lg">
                                            <p className="text-sm text-stone-600 font-medium">
                                                Saldo pendiente:{' '}
                                                <span className="text-lg font-bold text-red-600">
                                                    ${saldoPendiente.toLocaleString('es-AR')}
                                                </span>
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-stone-400">
                                    <Calculator className="h-12 w-12 mx-auto mb-4 opacity-30" />
                                    <p className="text-sm">
                                        Completá las fechas para ver el resumen
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
