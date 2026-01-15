import { useState, useEffect } from 'react'

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function useInstallPrompt() {
    const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
    const [isInstallable, setIsInstallable] = useState(false)

    useEffect(() => {
        const handleBeforeInstallPrompt = (e: Event) => {
            // Prevenir el mini-infobar automático en mobile
            e.preventDefault()
            // Guardar el evento para usarlo después
            setInstallPrompt(e as BeforeInstallPromptEvent)
            setIsInstallable(true)
        }

        const handleAppInstalled = () => {
            // Limpiar el prompt después de instalar
            setInstallPrompt(null)
            setIsInstallable(false)
        }

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
        window.addEventListener('appinstalled', handleAppInstalled)

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
            window.removeEventListener('appinstalled', handleAppInstalled)
        }
    }, [])

    const handleInstallClick = async () => {
        if (!installPrompt) return

        // Mostrar el prompt de instalación
        await installPrompt.prompt()

        // Esperar la respuesta del usuario
        const { outcome } = await installPrompt.userChoice

        // Limpiar el prompt
        setInstallPrompt(null)
        setIsInstallable(false)

        return outcome
    }

    return { isInstallable, handleInstallClick }
}
