import { NextRequest, NextResponse } from 'next/server'
import { ZodError } from 'zod'
import dbConnect from '@/lib/mongodb'
import Reserva, { IReserva } from '@/models/Reserva'
import { reservaSchema } from '@/lib/schemas'
import { obtenerCotizacionDolar, calcularMontoUSD } from '@/lib/dolar'

// Función para notificar a n8n con timeout y retry
async function notificarN8n(reserva: IReserva) {
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL

    // Si no está configurado el webhook, no hacer nada
    if (!n8nWebhookUrl) {
        console.log('⚠️ N8N_WEBHOOK_URL no está configurado, saltando notificación')
        return
    }

    try {
        // Crear un AbortController para timeout
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 8000) // 8 segundos timeout

        const response = await fetch(n8nWebhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombreCompleto: reserva.nombreCompleto,
                numeroCabana: reserva.numeroCabana,
                origenReserva: reserva.origenReserva,
                fechaInicio: reserva.fechaInicio.toISOString().split('T')[0],
                fechaFin: reserva.fechaFin.toISOString().split('T')[0],
                cantidadDias: reserva.cantidadDias,
                costoTotal: reserva.costoTotal,
                costoTotalUSD: reserva.costoTotalUSD,
                cotizacionDolar: reserva.cotizacionDolar,
                sena: reserva.sena || 0,
                saldoPendiente: reserva.saldoPendiente,
                estadoPago: reserva.estadoPago || 'pendiente'
            }),
            signal: controller.signal
        })

        clearTimeout(timeoutId)

        if (response.ok) {
            const result = await response.json()
            console.log('✅ Notificación enviada a n8n exitosamente:', result)
            return result
        } else {
            const errorText = await response.text()
            console.error('❌ Error en la respuesta de n8n:', response.status, errorText)
            throw new Error(`n8n respondió con status ${response.status}`)
        }
    } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            console.error('❌ Timeout al notificar a n8n (>8s)')
        } else {
            console.error('❌ Error al notificar a n8n:', error)
        }
        throw error
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Convertir las fechas de string a Date
        const data = {
            ...body,
            fechaInicio: new Date(body.fechaInicio),
            fechaFin: new Date(body.fechaFin),
            sena: Number(body.sena) || 0,
            costoTotal: Number(body.costoTotal)
        }

        // Validar los datos con Zod
        const validatedData = reservaSchema.parse(data)

        // Asegurar que tengamos un costoTotal válido
        if (!validatedData.costoTotal || validatedData.costoTotal <= 0) {
            throw new Error('El costo total debe ser mayor a 0')
        }

        // Si el origen es "Otro", usar el valor personalizado
        const origenFinal =
            validatedData.origenReserva === 'Otro'
                ? validatedData.origenReservaOtro || 'Otro'
                : validatedData.origenReserva

        // Obtener cotización del dólar blue
        const cotizacionDolar = await obtenerCotizacionDolar()
        const costoTotalUSD = calcularMontoUSD(validatedData.costoTotal, cotizacionDolar)

        // Calcular cantidad de días
        const diffTime = Math.abs(
            validatedData.fechaFin.getTime() - validatedData.fechaInicio.getTime()
        )
        const cantidadDias = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        // Calcular saldo pendiente
        const saldoPendiente = validatedData.costoTotal - (validatedData.sena || 0)

        // Determinar estado de pago
        const estadoPago = saldoPendiente === 0 ? 'pagado' : 'pendiente'

        // Conectar a la base de datos
        await dbConnect()

        // Crear la reserva con el origen correcto y los cálculos
        const reserva = await Reserva.create({
            nombreCompleto: validatedData.nombreCompleto,
            numeroCabana: validatedData.numeroCabana,
            origenReserva: origenFinal,
            fechaInicio: validatedData.fechaInicio,
            fechaFin: validatedData.fechaFin,
            costoTotal: validatedData.costoTotal,
            costoTotalUSD: costoTotalUSD,
            cotizacionDolar: cotizacionDolar,
            sena: validatedData.sena || 0,
            cantidadDias: cantidadDias,
            saldoPendiente: saldoPendiente,
            estadoPago: estadoPago,
            costoPorDia: validatedData.costoPorDia,
            porcentajeDescuento: validatedData.porcentajeDescuento || 0,
            telefono: validatedData.telefono || undefined
        })

        // Esperar a n8n para asegurar que se actualice el Excel (con timeout de 8s)
        // Usamos Promise.race para no bloquear más de 8 segundos
        try {
            await Promise.race([
                notificarN8n(reserva),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('n8n timeout')), 8000)
                )
            ])
        } catch (n8nError) {
            console.error('⚠️ Error al notificar a n8n, pero la reserva se guardó:', n8nError)
            // No lanzar error, solo loguear
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Reserva creada exitosamente',
                data: reserva
            },
            { status: 201 }
        )
    } catch (error: unknown) {
        console.error('Error al crear reserva:', error)

        if (error instanceof ZodError) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Error de validación',
                    errors: error.issues
                },
                { status: 400 }
            )
        }

        return NextResponse.json(
            {
                success: false,
                message: 'Error al crear la reserva',
                error: error instanceof Error ? error.message : 'Error desconocido'
            },
            { status: 500 }
        )
    }
}

export async function GET(request: NextRequest) {
    try {
        await dbConnect()

        const { searchParams } = new URL(request.url)
        const limit = parseInt(searchParams.get('limit') || '50')
        const page = parseInt(searchParams.get('page') || '1')
        const skip = (page - 1) * limit

        const reservas = await Reserva.find().sort({ createdAt: -1 }).limit(limit).skip(skip)

        const total = await Reserva.countDocuments()

        return NextResponse.json(
            {
                success: true,
                data: reservas,
                pagination: {
                    total,
                    page,
                    limit,
                    pages: Math.ceil(total / limit)
                }
            },
            { status: 200 }
        )
    } catch (error: unknown) {
        console.error('Error al obtener reservas:', error)
        return NextResponse.json(
            {
                success: false,
                message: 'Error al obtener las reservas',
                error: error instanceof Error ? error.message : 'Error desconocido'
            },
            { status: 500 }
        )
    }
}
