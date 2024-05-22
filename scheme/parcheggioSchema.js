const z = require('zod'); 

const parcheggioScheme = z.object({
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
        nord: z.number({
            invalid_type_error: 'nord must be a number',
            required_error: 'nord is required'
        }),
        est: z.number({
            invalid_type_error: 'est must be a number',
            required_error: 'est is required'
        })
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
        timeStart: z.date({
            invalid_type_error: 'timeStart must be a valid date'
        }),
        timeEnd: z.date({
            invalid_type_error: 'timeEnd must be a valid date'
        })
    })).optional()
});

exports.validateParcheggio = function (object) {
    const result = parcheggioScheme.safeParse(object);
    if (!result.success) {
        const errorMessages = result.error.errors.map(e => e.message);
        return { success: false, error: errorMessages };
    }
    return { success: true, data: result.data };
};

exports.validatePartialParcheggio = function (object) {
    const result = parcheggioScheme.partial().safeParse(object);
    if (!result.success) {
        const errorMessages = result.error.errors.map(e => e.message);
        return { success: false, error: errorMessages };
    }
    return { success: true, data: result.data };
};

/*
exports.validateParcheggio = function (object) {
    return parcheggioScheme.safeParse(object);
};


exports.validatePartialParcheggio = function (object) {
    return parcheggioScheme.partial().safeParse(object);
};
*/