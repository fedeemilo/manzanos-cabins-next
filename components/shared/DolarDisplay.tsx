'use client'

import { useEffect, useState } from 'react'
import { TrendingUp } from 'lucide-react'

export default function DolarDisplay() {
    const [cotizacion, setCotizacion] = useState<number | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/dolar')
            .then(res => res.json())
            .then(data => {
                setCotizacion(data.cotizacion)
                setLoading(false)
            })
            .catch(() => {
                setLoading(false)
            })
    }, [])

    if (loading) {
        return (
            <div className="bg-linear-to-r from-green-50 to-emerald-50 border border-green-200 rounded-md px-3 py-2 shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="animate-pulse bg-green-200 rounded-full p-1.5 w-7 h-7"></div>
                    <div className="flex-1">
                        <div className="animate-pulse h-3 bg-green-200 rounded w-20 mb-1"></div>
                        <div className="animate-pulse h-4 bg-green-200 rounded w-16"></div>
                    </div>
                </div>
            </div>
        )
    }

    if (!cotizacion) return null

    return (
        <div className="bg-linear-to-r from-green-50 to-emerald-50 border border-green-200 rounded-md px-3 py-2 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2">
                <div className="bg-green-600 rounded-full p-1.5">
                    <TrendingUp className="h-3.5 w-3.5 text-white" />
                </div>
                <div className="flex-1">
                    <p className="text-xs text-green-700 font-medium leading-tight">
                        Dólar Blue (Venta)
                    </p>
                    <p className="text-lg font-bold text-green-800 leading-tight">
                        ${cotizacion.toLocaleString('es-AR')}
                    </p>
                </div>
            </div>
        </div>
    )
}
