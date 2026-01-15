import { z } from 'zod'

export const reservaSchema = z
    .object({
        nombreCompleto: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
        numeroCabana: z.enum(['1', '2'], {
            message: 'Por favor, seleccioná el número de cabaña'
        }),
        origenReserva: z.enum(['Booking', 'Airbnb', 'Particular', 'Otro'], {
            message: 'Por favor, seleccioná el origen de la reserva'
        }),
        origenReservaOtro: z.string().optional(),
        sena: z.number().min(0, 'La seña no puede ser negativa').optional(),
        costoTotal: z.number().min(0, 'El costo total no puede ser negativo').optional(),
        costoPorDia: z.number().min(0, 'El costo por día no puede ser negativo').optional(),
        porcentajeDescuento: z
            .number()
            .min(0, 'El descuento no puede ser negativo')
            .max(100, 'El descuento no puede ser mayor a 100')
            .optional(),
        tipoCostoInput: z.enum(['porDia', 'total']).optional(),
        fechaInicio: z.date({
            message: 'Por favor, seleccioná la fecha de entrada'
        }),
        fechaFin: z.date({
            message: 'Por favor, seleccioná la fecha de salida'
        })
    })
    .refine(data => data.fechaFin > data.fechaInicio, {
        message: 'La fecha de fin debe ser posterior a la fecha de inicio',
        path: ['fechaFin']
    })
    .refine(
        data => {
            // Al menos uno de los dos debe estar presente
            return data.costoTotal !== undefined || data.costoPorDia !== undefined
        },
        {
            message: 'Debe ingresar el costo total o el costo por día',
            path: ['costoTotal']
        }
    )
    .refine(
        data => {
            if (data.sena && data.sena > 0 && data.costoTotal) {
                return data.sena <= data.costoTotal
            }
            return true
        },
        {
            message: 'La seña no puede ser mayor al costo total',
            path: ['sena']
        }
    )
    .refine(
        data => {
            if (data.origenReserva === 'Otro') {
                return data.origenReservaOtro && data.origenReservaOtro.trim().length > 0
            }
            return true
        },
        {
            message: 'Debe especificar el origen cuando selecciona "Otro"',
            path: ['origenReservaOtro']
        }
    )

export type ReservaFormData = z.infer<typeof reservaSchema>
