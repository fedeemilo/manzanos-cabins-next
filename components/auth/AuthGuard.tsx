'use client'

import { useState, useEffect } from 'react'
import { isAuthenticated, logout } from '@/lib/auth'
import LoginForm from './LoginForm'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import toast from 'react-hot-toast'

interface AuthGuardProps {
    children: React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
    const [isAuth, setIsAuth] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Verificar autenticación al montar el componente
        const checkAuth = () => {
            const authStatus = isAuthenticated()
            setIsAuth(authStatus)
            setIsLoading(false)
        }

        // Ejecutar en el siguiente tick para evitar warning
        setTimeout(checkAuth, 0)
    }, [])

    const handleLoginSuccess = () => {
        setIsAuth(true)
    }

    const handleLogout = () => {
        logout()
        toast.success('Sesión cerrada correctamente. ¡Hasta pronto! 👋')
        setIsAuth(false)
    }

    // Mostrar loading mientras verifica autenticación
    if (isLoading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-stone-100 via-stone-50 to-amber-50 flex items-center justify-center">
                <div className="text-stone-600 text-lg">Cargando...</div>
            </div>
        )
    }

    // Mostrar login si no está autenticado
    if (!isAuth) {
        return <LoginForm onLoginSuccess={handleLoginSuccess} />
    }

    // Mostrar contenido protegido con botón de logout
    return (
        <>
            {children}
            {/* Botón flotante de logout */}
            <Button
                onClick={handleLogout}
                className="fixed bottom-6 right-6 bg-stone-700 hover:bg-stone-800 text-white shadow-lg z-50 cursor-pointer"
                size="lg"
            >
                <LogOut className="h-5 w-5 mr-2" />
                Cerrar Sesión
            </Button>
        </>
    )
}
