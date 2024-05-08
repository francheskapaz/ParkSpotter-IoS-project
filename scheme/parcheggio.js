const z = require('zod')

const parcheggioScheme = z.object({
    id: z.string({
        invalid_type_error: 'id must be a string',
        required_error: 'ide is required' 
    }),
    name: z.string({
        invalid_type_error: 'name must be a string',
        required_error: 'name is required'
    }),

    fee: z.number({
        invalid_type_error: 'fee must be a number',
        required_error: 'fee is required'
    }),

    maxStop: z.number({
        required_error: 'maxStop is required',
        invalid_type_error: 'maxStop must be a number'
    }),

    open: z.boolean({
        invalid_type_error: 'open must be a boolean',
        required_error: 'open is required' 
    }),
    coordinates: z.object({
        nord: z.number(),
        est: z.number()
    }),

    nParkingSpaces: z.number({
        required_error: 'nParkingSpaces is required'
    }).int({
        invalid_type_error: 'nParkingSpaces must be an integer'
    }),

    vehicleType: z.string({
        invalid_type_error: 'vehicleType must be a string',
        required_error: 'vehicleType is required' 
    }),

    nFree: z.number({
        required_error: 'nFree is required'
    }).int({
        invalid_type_error: 'nFree must be an integer'
    }),

    reservations: z.array(z.object({
        timeStart: z.string(),
        timeEnd: z.string()
    }))
})

function validateParcheggio (object) {
    return parcheggioScheme.safeParse(object)
}
function validatePartialParcheggio(object) {
    return parcheggioScheme.partial().safeParse(object)
}

module.exports = {
    validateParcheggio, 
    validatePartialParcheggio
}