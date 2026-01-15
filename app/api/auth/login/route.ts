import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
    try {
        const { username, password } = await request.json()

        // Validar que existan las variables de entorno
        const validUsername = process.env.AUTH_USERNAME
        const validPassword = process.env.AUTH_PASSWORD

        if (!validUsername || !validPassword) {
            console.error('❌ Variables de autenticación no configuradas en .env')
            return NextResponse.json(
                {
                    success: false,
                    message: 'Error de configuración del servidor'
                },
                { status: 500 }
            )
        }

        // Verificar credenciales
        if (username === validUsername && password === validPassword) {
            // Generar token simple (hash del username + timestamp)
            const token = crypto
                .createHash('sha256')
                .update(`${username}-${Date.now()}-${process.env.AUTH_PASSWORD}`)
                .digest('hex')

            return NextResponse.json(
                {
                    success: true,
                    token,
                    message: 'Autenticación exitosa'
                },
                { status: 200 }
            )
        }

        // Credenciales inválidas
        return NextResponse.json(
            {
                success: false,
                message: 'Usuario o contraseña incorrectos'
            },
            { status: 401 }
        )
    } catch (error) {
        console.error('Error en login:', error)
        return NextResponse.json(
            {
                success: false,
                message: 'Error al procesar la solicitud'
            },
            { status: 500 }
        )
    }
}
