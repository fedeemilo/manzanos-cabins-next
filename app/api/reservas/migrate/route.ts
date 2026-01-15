import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import mongoose from 'mongoose'

// Endpoint temporal para migrar reservas existentes
export async function POST() {
    try {
        await dbConnect()

        // Usar MongoDB directamente sin el modelo de Mongoose
        const db = mongoose.connection.db
        if (!db) {
            throw new Error('No hay conexión a la base de datos')
        }

        const reservasCollection = db.collection('reservas')

        // Actualizar TODAS las reservas, agregando estadoPago basado en saldoPendiente
        const result = await reservasCollection.updateMany({}, [
            {
                $set: {
                    estadoPago: {
                        $cond: {
                            if: { $eq: ['$saldoPendiente', 0] },
                            then: 'pagado',
                            else: 'pendiente'
                        }
                    }
                }
            }
        ])

        return NextResponse.json(
            {
                success: true,
                message: `Migración completada. ${result.modifiedCount} documentos actualizados.`,
                matched: result.matchedCount,
                modified: result.modifiedCount
            },
            { status: 200 }
        )
    } catch (error: unknown) {
        console.error('Error en migración:', error)
        return NextResponse.json(
            {
                success: false,
                message: 'Error en la migración',
                error: error instanceof Error ? error.message : 'Error desconocido'
            },
            { status: 500 }
        )
    }
}
