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
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="animate-pulse bg-green-200 rounded-full p-2 w-10 h-10"></div>
                    <div className="flex-1">
                        <div className="animate-pulse h-4 bg-green-200 rounded w-24 mb-2"></div>
                        <div className="animate-pulse h-6 bg-green-200 rounded w-32"></div>
                    </div>
                </div>
            </div>
        )
    }

    if (!cotizacion) return null

    return (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
                <div className="bg-green-600 rounded-full p-2">
                    <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                    <p className="text-sm text-green-700 font-medium">Dólar Blue (Venta)</p>
                    <p className="text-2xl font-bold text-green-800">
                        ${cotizacion.toLocaleString('es-AR')}
                    </p>
                </div>
            </div>
        </div>
    )
}
