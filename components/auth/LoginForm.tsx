'use client'

import { useState, FormEvent } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Loader2, Lock } from 'lucide-react'
import { login } from '@/lib/auth'
import toast from 'react-hot-toast'

interface LoginFormProps {
    onLoginSuccess: () => void
}

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            })

            const data = await response.json()

            if (data.success && data.token) {
                login(data.token)
                toast.success('¡Bienvenido! Sesión iniciada correctamente 🎉')
                // Pequeño delay para que se vea el toast antes de renderizar la app
                setTimeout(() => {
                    onLoginSuccess()
                }, 300)
            } else {
                setError(data.message || 'Error al iniciar sesión')
            }
        } catch (err) {
            setError('Error de conexión. Intenta nuevamente.')
            console.error('Error en login:', err)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-stone-100 via-stone-50 to-amber-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-2xl border-stone-200">
                <CardHeader className="space-y-3 bg-linear-to-br from-stone-50 to-stone-100 border-b border-stone-200">
                    <div className="flex items-center justify-center">
                        <div className="bg-stone-700 p-4 rounded-full">
                            <Lock className="h-8 w-8 text-white" />
                        </div>
                    </div>
                    <CardTitle className="text-3xl font-bold text-stone-800 text-center">
                        🏡 Cabañas Los Manzanos
                    </CardTitle>
                    <CardDescription className="text-center text-stone-600 text-base">
                        Sistema de Gestión de Reservas
                    </CardDescription>
                </CardHeader>

                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="username" className="text-stone-700 font-medium">
                                Usuario
                            </Label>
                            <Input
                                id="username"
                                type="text"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                placeholder="Ingresá tu usuario"
                                className="border-stone-300 focus:border-stone-500"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-stone-700 font-medium">
                                Contraseña
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Ingresá tu contraseña"
                                className="border-stone-300 focus:border-stone-500"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-stone-700 hover:bg-stone-800 text-white font-semibold py-6 text-lg cursor-pointer"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Ingresando...
                                </>
                            ) : (
                                <>
                                    <Lock className="mr-2 h-5 w-5" />
                                    Iniciar Sesión
                                </>
                            )}
                        </Button>
                    </form>

                    <p className="text-xs text-stone-500 text-center mt-6">
                        Acceso restringido solo para personal autorizado
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
