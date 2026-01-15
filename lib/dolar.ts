// Obtener cotización del dólar blue desde API pública
export async function obtenerCotizacionDolar(): Promise<number> {
    try {
        // API pública argentina de dólar blue
        const response = await fetch('https://dolarapi.com/v1/dolares/blue', {
            next: { revalidate: 3600 } // Cache de 1 hora
        })

        if (!response.ok) {
            throw new Error('Error al obtener cotización')
        }

        const data = await response.json()
        // Usamos el precio de venta
        return data.venta || 1200 // Fallback a 1200 si falla
    } catch (error) {
        console.error('Error obteniendo cotización dólar:', error)
        // Valor por defecto si la API falla
        return 1200
    }
}

// Calcular monto en dólares
export function calcularMontoUSD(montoPesos: number, cotizacion: number): number {
    return Math.round((montoPesos / cotizacion) * 100) / 100 // Redondeo a 2 decimales
}
