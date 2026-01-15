import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'
import Navbar from '@/components/shared/Navbar'
import AuthGuard from '@/components/auth/AuthGuard'

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin']
})

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin']
})

export const metadata: Metadata = {
    title: 'Cabañas Los Manzanos - Sistema de Reservas',
    description:
        'Sistema de gestión de reservas para Cabañas Los Manzanos, San Martín de los Andes',
    manifest: '/manifest.json',
    themeColor: '#44403c',
    icons: {
        icon: '/favicon.ico',
        apple: '/icon-192.png'
    },
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'Los Manzanos'
    }
}

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="es">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <AuthGuard>
                    <Navbar />
                    {children}
                </AuthGuard>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 3000,
                        style: {
                            background: '#363636',
                            color: '#fff',
                            padding: '16px',
                            borderRadius: '8px'
                        },
                        success: {
                            duration: 3000,
                            iconTheme: {
                                primary: '#10b981',
                                secondary: '#fff'
                            }
                        }
                    }}
                />
            </body>
        </html>
    )
}
