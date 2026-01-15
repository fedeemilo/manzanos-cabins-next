// Funciones de autenticación simple

const AUTH_TOKEN_KEY = 'manzanos_auth_token'
const AUTH_EXPIRY_KEY = 'manzanos_auth_expiry'

// Duración de la sesión: 7 días
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000

export function isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false

    const token = localStorage.getItem(AUTH_TOKEN_KEY)
    const expiry = localStorage.getItem(AUTH_EXPIRY_KEY)

    if (!token || !expiry) return false

    // Verificar si la sesión expiró
    const expiryDate = new Date(expiry)
    if (expiryDate < new Date()) {
        logout()
        return false
    }

    return true
}

export function login(token: string): void {
    const expiry = new Date(Date.now() + SESSION_DURATION)
    localStorage.setItem(AUTH_TOKEN_KEY, token)
    localStorage.setItem(AUTH_EXPIRY_KEY, expiry.toISOString())
}

export function logout(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem(AUTH_EXPIRY_KEY)
}

export function getAuthToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(AUTH_TOKEN_KEY)
}
