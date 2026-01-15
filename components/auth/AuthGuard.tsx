'use client'

import { useState, useEffect } from 'react'
import { isAuthenticated, logout } from '@/lib/auth'
import LoginForm from './LoginForm'
import { Button } from '@/components/ui/button'
import { LogOut, Download } from 'lucide-react'
import toast from 'react-hot-toast'
import { useInstallPrompt } from '@/lib/useInstallPrompt'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from '@/components/ui/alert-dialog'

interface AuthGuardProps {
    children: React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
    const [isAuth, setIsAuth] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const { isInstallable, handleInstallClick } = useInstallPrompt()

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

    const handleInstall = async () => {
        const outcome = await handleInstallClick()
        if (outcome === 'accepted') {
            toast.success('¡App instalada correctamente! 📱')
        }
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

    // Mostrar contenido protegido con botones flotantes
    return (
        <>
            {children}
            {/* Botones flotantes */}
            <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
                {/* Botón de instalación PWA (solo si es instalable) */}
                {isInstallable && (
                    <Button
                        onClick={handleInstall}
                        className="bg-amber-600 hover:bg-amber-700 text-white shadow-lg cursor-pointer"
                        size="lg"
                    >
                        <Download className="h-5 w-5 mr-2" />
                        Instalar App
                    </Button>
                )}

                {/* Botón de logout con confirmación */}
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            className="bg-stone-700 hover:bg-stone-800 text-white shadow-lg cursor-pointer"
                            size="lg"
                        >
                            <LogOut className="h-5 w-5 mr-2" />
                            Cerrar Sesión
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-stone-800">
                                ¿Cerrar sesión?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-stone-600">
                                ¿Estás seguro que querés cerrar sesión? Tendrás que volver a
                                ingresar tus credenciales para acceder nuevamente.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="cursor-pointer">
                                Cancelar
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleLogout}
                                className="bg-red-600 hover:bg-red-700 cursor-pointer"
                            >
                                Cerrar Sesión
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </>
    )
}
