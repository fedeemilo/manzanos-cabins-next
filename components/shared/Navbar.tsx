'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, FileText } from 'lucide-react'
import DolarDisplay from './DolarDisplay'

export default function Navbar() {
    const pathname = usePathname()

    const navItems = [
        {
            name: 'Nueva Reserva',
            path: '/',
            icon: Home
        },
        {
            name: 'Gestión',
            path: '/gestion',
            icon: FileText
        }
    ]

    return (
        <nav className="bg-white border-b border-stone-200 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 relative">
                <div className="flex items-center justify-between h-16 gap-4 pr-48 md:pr-60">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center gap-2 font-bold text-stone-800 hover:text-stone-600 transition-colors"
                    >
                        <span className="text-2xl">🏡</span>
                        <span className="hidden sm:block">Cabañas Los Manzanos</span>
                        <span className="sm:hidden">Los Manzanos</span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex items-center gap-2">
                        {navItems.map(item => {
                            const isActive = pathname === item.path
                            const Icon = item.icon

                            return (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    className={`
                                        flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg font-medium transition-all text-sm md:text-base
                                        ${
                                            isActive
                                                ? 'bg-stone-700 text-white'
                                                : 'text-stone-600 hover:bg-stone-100 hover:text-stone-800'
                                        }
                                    `}
                                >
                                    <Icon className="h-4 w-4" />
                                    <span className="hidden sm:block">{item.name}</span>
                                </Link>
                            )
                        })}
                    </div>
                </div>

                {/* Dólar Blue - Posición absoluta en esquina derecha */}
                <div className="absolute top-1/2 right-4 -translate-y-1/2 z-10">
                    <DolarDisplay />
                </div>
            </div>
        </nav>
    )
}
