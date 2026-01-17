import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Reserva from '@/models/Reserva'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect()
        const { id } = await params

        const reserva = await Reserva.findById(id)

        if (!reserva) {
            return NextResponse.json(
                { success: false, message: 'Reserva no encontrada' },
                { status: 404 }
            )
        }

        return NextResponse.json(
            {
                success: true,
                data: reserva
            },
            { status: 200 }
        )
    } catch (error: unknown) {
        console.error('Error al obtener reserva:', error)
        return NextResponse.json(
            {
                success: false,
                message: 'Error al obtener la reserva',
                error: error instanceof Error ? error.message : 'Error desconocido'
            },
            { status: 500 }
        )
    }
}
