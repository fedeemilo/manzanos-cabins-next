import mongoose, { Schema, Document } from 'mongoose'

export interface IReserva extends Document {
    nombreCompleto: string
    telefono?: string
    numeroCabana: string
    origenReserva: string
    sena: number
    costoTotal: number
    costoPorDia?: number
    porcentajeDescuento?: number
    costoTotalUSD: number
    cotizacionDolar: number
    saldoPendiente: number
    estadoPago: 'pendiente' | 'pagado'
    fechaInicio: Date
    fechaFin: Date
    cantidadDias: number
    createdAt: Date
    updatedAt: Date
}

const ReservaSchema: Schema = new Schema(
    {
        nombreCompleto: {
            type: String,
            required: [true, 'El nombre completo es requerido'],
            trim: true
        },
        telefono: {
            type: String,
            required: false,
            trim: true
        },
        numeroCabana: {
            type: String,
            required: [true, 'El número de cabaña es requerido'],
            enum: ['1', '2']
        },
        origenReserva: {
            type: String,
            required: [true, 'El origen de la reserva es requerido'],
            trim: true
        },
        sena: {
            type: Number,
            required: false,
            default: 0,
            min: [0, 'La seña no puede ser negativa']
        },
        costoTotal: {
            type: Number,
            required: [true, 'El costo total es requerido'],
            min: [0, 'El costo total no puede ser negativo']
        },
        costoPorDia: {
            type: Number,
            min: [0, 'El costo por día no puede ser negativo']
        },
        porcentajeDescuento: {
            type: Number,
            min: [0, 'El porcentaje de descuento no puede ser negativo'],
            max: [100, 'El porcentaje de descuento no puede ser mayor a 100']
        },
        costoTotalUSD: {
            type: Number,
            required: true
        },
        cotizacionDolar: {
            type: Number,
            required: true
        },
        saldoPendiente: {
            type: Number,
            required: false,
            default: 0
        },
        estadoPago: {
            type: String,
            enum: ['pendiente', 'pagado'],
            default: 'pendiente'
        },
        fechaInicio: {
            type: Date,
            required: [true, 'La fecha de inicio es requerida']
        },
        fechaFin: {
            type: Date,
            required: [true, 'La fecha de fin es requerida'],
            validate: {
                validator: function (this: IReserva, value: Date) {
                    return value > this.fechaInicio
                },
                message: 'La fecha de fin debe ser posterior a la fecha de inicio'
            }
        },
        cantidadDias: {
            type: Number,
            required: false,
            default: 0
        }
    },
    {
        timestamps: true
    }
)

// Middleware para calcular saldo pendiente y cantidad de días antes de guardar
ReservaSchema.pre('save', function (this: IReserva) {
    // Calcular saldo pendiente
    this.saldoPendiente = this.costoTotal - (this.sena || 0)

    // Calcular cantidad de días
    const diffTime = Math.abs(this.fechaFin.getTime() - this.fechaInicio.getTime())
    this.cantidadDias = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    // Solo setear estadoPago automáticamente si no fue modificado manualmente
    // Esto permite cambiar el estado a "pagado" incluso si hay saldo pendiente
    if (!this.isModified('estadoPago')) {
        this.estadoPago = this.saldoPendiente === 0 ? 'pagado' : 'pendiente'
    }
})

export default mongoose.models.Reserva || mongoose.model<IReserva>('Reserva', ReservaSchema)
