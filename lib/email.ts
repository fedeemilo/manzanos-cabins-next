import nodemailer from 'nodemailer'
import { IReserva } from '@/models/Reserva'

export async function enviarEmailReserva(reserva: IReserva) {
    // Usar puerto 465 con SSL para evitar bloqueos en Vercel
    const useSSL = process.env.EMAIL_PORT === '465'
    
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        secure: useSSL, // true para puerto 465, false para 587
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        },
        connectionTimeout: 10000, // 10 segundos
        greetingTimeout: 10000, // 10 segundos
        socketTimeout: 10000, // 10 segundos
        pool: false, // No usar pool en serverless
        tls: {
            rejectUnauthorized: false // Permitir certificados auto-firmados
        }
    })

    const fechaInicio = new Date(reserva.fechaInicio).toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    })

    const fechaFin = new Date(reserva.fechaFin).toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    })

    const origenDisplay = reserva.origenReserva

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f5f5f0;
          margin: 0;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #8B6F47 0%, #A0826D 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 600;
        }
        .content {
          padding: 40px 30px;
        }
        .info-card {
          background-color: #faf9f7;
          border-left: 4px solid #8B6F47;
          padding: 20px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #e5e5e0;
        }
        .info-row:last-child {
          border-bottom: none;
        }
        .label {
          color: #666;
          font-weight: 500;
        }
        .value {
          color: #333;
          font-weight: 600;
          text-align: right;
        }
        .highlight {
          background-color: #fff4e6;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
          text-align: center;
        }
        .highlight .amount {
          font-size: 32px;
          color: #8B6F47;
          font-weight: 700;
          margin: 10px 0;
        }
        .footer {
          background-color: #faf9f7;
          padding: 20px 30px;
          text-align: center;
          color: #666;
          font-size: 14px;
        }
        .badge {
          display: inline-block;
          padding: 6px 12px;
          background-color: #8B6F47;
          color: white;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 500;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏡 Nueva Reserva - Cabañas Los Manzanos</h1>
        </div>
        
        <div class="content">
          <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
            Se ha registrado una nueva reserva en el sistema. A continuación los detalles:
          </p>
          
           <div class="info-card">
             <div class="info-row">
               <span class="label">Huésped:</span>
               <span class="value">${reserva.nombreCompleto}</span>
             </div>
             <div class="info-row">
               <span class="label">Cabaña:</span>
               <span class="badge">Cabaña ${reserva.numeroCabana}</span>
             </div>
             <div class="info-row">
               <span class="label">Origen:</span>
               <span class="badge">${origenDisplay}</span>
             </div>
             <div class="info-row">
               <span class="label">Fecha de entrada:</span>
               <span class="value">${fechaInicio}</span>
             </div>
             <div class="info-row">
               <span class="label">Fecha de salida:</span>
               <span class="value">${fechaFin}</span>
             </div>
             <div class="info-row">
               <span class="label">Cantidad de días:</span>
               <span class="value">${reserva.cantidadDias} días</span>
             </div>
           </div>

           <div class="highlight">
             <div style="color: #666; font-size: 14px; margin-bottom: 5px;">Costo Total</div>
             <div class="amount">$${reserva.costoTotal.toLocaleString('es-AR')}</div>
             <div style="color: #666; font-size: 13px; margin-top: 8px;">
               USD $${reserva.costoTotalUSD.toLocaleString(
                   'en-US'
               )} (Dólar blue: $${reserva.cotizacionDolar.toLocaleString('es-AR')})
             </div>
           </div>

           <div class="info-card">
             <div class="info-row">
               <span class="label">Seña recibida:</span>
               <span class="value" style="color: #2e7d32;">$${reserva.sena.toLocaleString(
                   'es-AR'
               )}</span>
             </div>
             <div class="info-row">
               <span class="label">Saldo pendiente:</span>
               <span class="value" style="color: #d32f2f;">$${reserva.saldoPendiente.toLocaleString(
                   'es-AR'
               )}</span>
             </div>
           </div>

          <p style="font-size: 14px; color: #666; margin-top: 30px; text-align: center;">
            Por favor, verificá los datos y confirmá la reserva.
          </p>
        </div>
        
        <div class="footer">
          <p style="margin: 5px 0;">Cabañas Los Manzanos - San Martín de los Andes</p>
          <p style="margin: 5px 0;">Este es un email automático, por favor no responder.</p>
        </div>
      </div>
    </body>
    </html>
  `

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: process.env.EMAIL_TO,
        subject: `Nueva Reserva - ${reserva.nombreCompleto} (${fechaInicio} - ${fechaFin})`,
        html: htmlContent
    }

    try {
        await transporter.sendMail(mailOptions)
        console.log('Email enviado exitosamente')
    } catch (error) {
        console.error('Error al enviar el email:', error)
        throw error
    }
}
