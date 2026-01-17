import type { Metadata } from 'next'

export async function generateMetadata({
    params
}: {
    params: Promise<{ id: string }>
}): Promise<Metadata> {
    const { id } = await params

    return {
        title: 'Reserva - Cabañas Los Manzanos',
        description:
            'Detalle de tu reserva en Cabañas Los Manzanos, San Martín de los Andes, Neuquén',
        openGraph: {
            title: 'Reserva en Cabañas Los Manzanos',
            description: 'Tu estadía en San Martín de los Andes te espera!',
            images: [
                {
                    url: '/cabin-preview.png',
                    width: 1200,
                    height: 630,
                    alt: 'Cabañas Los Manzanos - San Martín de los Andes'
                }
            ],
            locale: 'es_AR',
            type: 'website',
            siteName: 'Cabañas Los Manzanos'
        },
        twitter: {
            card: 'summary_large_image',
            title: 'Reserva en Cabañas Los Manzanos',
            description: 'Tu estadía en San Martín de los Andes te espera!',
            images: ['/cabin-preview.png']
        }
    }
}

export default function ReservaLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
