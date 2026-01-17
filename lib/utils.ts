import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
 * Acorta una URL usando el servicio is.gd
 * @param url URL completa a acortar
 * @returns URL acortada o la original si falla
 */
export async function acortarURL(url: string): Promise<string> {
    try {
        const response = await fetch(
            `https://is.gd/create.php?format=simple&url=${encodeURIComponent(url)}`
        )
        
        if (!response.ok) {
            throw new Error('Error al acortar URL')
        }
        
        const shortUrl = await response.text()
        return shortUrl.trim()
    } catch (error) {
        console.error('Error acortando URL:', error)
        return url // Devolver URL original si falla
    }
}

