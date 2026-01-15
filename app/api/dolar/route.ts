import { NextResponse } from 'next/server'
import { obtenerCotizacionDolar } from '@/lib/dolar'

export async function GET() {
    try {
        const cotizacion = await obtenerCotizacionDolar()
        return NextResponse.json({ cotizacion }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ cotizacion: 1200 }, { status: 200 })
    }
}
