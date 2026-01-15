import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Reserva from '@/models/Reserva'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect()

        const { id } = await params
        const body = await request.json()

        console.log('🔧 PATCH request recibido')
        console.log('ID:', id)
        console.log('Body:', body)

        // Validar que el ID sea válido
        if (!id || id.length !== 24) {
            console.log('❌ ID inválido:', id)
            return NextResponse.json(
                {
                    success: false,
                    message: 'ID de reserva inválido'
                },
                { status: 400 }
            )
        }

        // Buscar la reserva
        const reserva = await Reserva.findById(id)

        if (!reserva) {
            console.log('❌ Reserva no encontrada:', id)
            return NextResponse.json(
                {
                    success: false,
                    message: 'Reserva no encontrada'
                },
                { status: 404 }
            )
        }

        console.log('📋 Reserva encontrada:', reserva.nombreCompleto)
        console.log('Estado actual:', reserva.estadoPago)

        // Actualizar el estado de pago
        reserva.estadoPago = body.estadoPago

        console.log('💾 Guardando con nuevo estado:', body.estadoPago)

        // Guardar (esto dispara el middleware pre('save'))
        await reserva.save()

        console.log('✅ Reserva actualizada exitosamente')
        console.log('Nuevo estado:', reserva.estadoPago)

        return NextResponse.json(
            {
                success: true,
                message: 'Estado de pago actualizado',
                data: reserva
            },
            { status: 200 }
        )
    } catch (error: unknown) {
        console.error('❌ Error al actualizar reserva:', error)
        return NextResponse.json(
            {
                success: false,
                message: 'Error al actualizar la reserva',
                error: error instanceof Error ? error.message : 'Error desconocido'
            },
            { status: 500 }
        )
    }
}
