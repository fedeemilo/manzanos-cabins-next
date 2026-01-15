import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Reserva from '@/models/Reserva'

export async function GET(request: NextRequest) {
    try {
        await dbConnect()

        const { searchParams } = new URL(request.url)
        const fechaInicio = searchParams.get('fechaInicio')
        const fechaFin = searchParams.get('fechaFin')
        const numeroCabana = searchParams.get('numeroCabana')

        if (!fechaInicio || !fechaFin || !numeroCabana) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Faltan parámetros requeridos'
                },
                { status: 400 }
            )
        }

        const inicio = new Date(fechaInicio)
        const fin = new Date(fechaFin)

        // Buscar reservas que se superpongan con el rango de fechas
        // Una reserva se superpone si: (fechaInicio < fin) && (fechaFin > inicio)
        const reservasSuperpuestas = await Reserva.find({
            numeroCabana: numeroCabana,
            fechaInicio: { $lt: fin },
            fechaFin: { $gt: inicio }
        })

        const estaDisponible = reservasSuperpuestas.length === 0

        return NextResponse.json(
            {
                success: true,
                disponible: estaDisponible,
                reservasExistentes: reservasSuperpuestas.length
            },
            { status: 200 }
        )
    } catch (error: unknown) {
        console.error('Error al verificar disponibilidad:', error)
        return NextResponse.json(
            {
                success: false,
                message: 'Error al verificar disponibilidad',
                error: error instanceof Error ? error.message : 'Error desconocido'
            },
            { status: 500 }
        )
    }
}
