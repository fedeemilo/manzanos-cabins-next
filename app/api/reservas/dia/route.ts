import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Reserva from '@/models/Reserva'

export async function GET(request: NextRequest) {
    try {
        await dbConnect()

        const { searchParams } = new URL(request.url)
        const fechaParam = searchParams.get('fecha')

        if (!fechaParam) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Parámetro fecha es requerido'
                },
                { status: 400 }
            )
        }

        // Parsear la fecha
        const fecha = new Date(fechaParam)

        // Obtener inicio y fin del día
        const inicioDia = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate())
        const finDia = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate() + 1)

        // Buscar reservas que incluyan este día
        // Una reserva "incluye" un día si: fechaInicio <= día < fechaFin
        const reservas = await Reserva.find({
            fechaInicio: { $lte: finDia },
            fechaFin: { $gte: inicioDia }
        }).sort({ fechaInicio: 1 })

        return NextResponse.json(
            {
                success: true,
                data: reservas,
                fecha: fechaParam
            },
            { status: 200 }
        )
    } catch (error: unknown) {
        console.error('Error al obtener reservas del día:', error)
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
