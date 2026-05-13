import Joi from "joi";

const entryFormSchema = Joi.object({
    step: Joi.number()
        .integer()
        .positive()
        .valid(1)
        .required(),

    category: Joi.number()
        .valid(1, 2)
        .required(),

    title_of_film_in_roman: Joi.string()
        .required(),

    title_of_film_in_devanagari: Joi.string()
        .required(),

    english_translation_of_film: Joi.string()
        .required(),

    title_of_script_langauge: Joi.string()
        .required(),

    language_id: Joi.number()
        .required(),

    // Conditional: required when language_id is not 5
    whether_subtitle_english: Joi.when('language_id', {
        is: Joi.not(5),
        then: Joi.number().valid(1).required(),
        otherwise: Joi.optional()
    }),

    // DCP field - required_without based on category
    dcp: Joi.when('category', {
        is: 1,
        then: Joi.number().valid(1, 2, 3).required(),
        otherwise: Joi.when('category', {
            is: 2,
            then: Joi.number().valid(1, 2, 3).when('blueray', {
                is: Joi.exist(),
                then: Joi.optional(),
                otherwise: Joi.when('pendrive', {
                    is: Joi.exist(),
                    then: Joi.optional(),
                    otherwise: Joi.required()
                })
            }),
            otherwise: Joi.optional()
        })
    }),

    blueray: Joi.optional(),
    pendrive: Joi.optional(),

    // DCP = 1 fields (for both categories)
    dci_compliant_jpeg_2000: Joi.when('dcp', {
        is: 1,
        then: Joi.number().valid(1).when(Joi.ref('subtitle_to_be_burned_in_picture'), {
            is: Joi.exist(),
            then: Joi.optional(),
            otherwise: Joi.when(Joi.ref('dcp_should_cru_hard_disk'), {
                is: Joi.exist(),
                then: Joi.optional(),
                otherwise: Joi.when(Joi.ref('hard_disk_format_ext2_ext3'), {
                    is: Joi.exist(),
                    then: Joi.optional(),
                    otherwise: Joi.required()
                })
            })
        }),
        otherwise: Joi.optional()
    }),

    subtitle_to_be_burned_in_picture: Joi.when('dcp', {
        is: 1,
        then: Joi.number().valid(1).when(Joi.ref('dcp_should_cru_hard_disk'), {
            is: Joi.exist(),
            then: Joi.optional(),
            otherwise: Joi.when(Joi.ref('hard_disk_format_ext2_ext3'), {
                is: Joi.exist(),
                then: Joi.optional(),
                otherwise: Joi.when(Joi.ref('dci_compliant_jpeg_2000'), {
                    is: Joi.exist(),
                    then: Joi.optional(),
                    otherwise: Joi.required()
                })
            })
        }),
        otherwise: Joi.optional()
    }),

    dcp_should_cru_hard_disk: Joi.when('dcp', {
        is: 1,
        then: Joi.number().valid(1).when(Joi.ref('hard_disk_format_ext2_ext3'), {
            is: Joi.exist(),
            then: Joi.optional(),
            otherwise: Joi.when(Joi.ref('subtitle_to_be_burned_in_picture'), {
                is: Joi.exist(),
                then: Joi.optional(),
                otherwise: Joi.when(Joi.ref('dci_compliant_jpeg_2000'), {
                    is: Joi.exist(),
                    then: Joi.optional(),
                    otherwise: Joi.required()
                })
            })
        }),
        otherwise: Joi.optional()
    }),

    hard_disk_format_ext2_ext3: Joi.when('dcp', {
        is: 1,
        then: Joi.number().valid(1).when(Joi.ref('dcp_should_cru_hard_disk'), {
            is: Joi.exist(),
            then: Joi.optional(),
            otherwise: Joi.when(Joi.ref('subtitle_to_be_burned_in_picture'), {
                is: Joi.exist(),
                then: Joi.optional(),
                otherwise: Joi.when(Joi.ref('dci_compliant_jpeg_2000'), {
                    is: Joi.exist(),
                    then: Joi.optional(),
                    otherwise: Joi.required()
                })
            })
        }),
        otherwise: Joi.optional()
    }),

    is_dcp_unencrypted: Joi.when('dcp', {
        is: 1,
        then: Joi.number().valid(1).required(),
        otherwise: Joi.optional()
    }),

    // DCP = 2 fields (for both categories)
    blueray_region_free_pal: Joi.when('dcp', {
        is: 2,
        then: Joi.number().valid(1).required(),
        otherwise: Joi.optional()
    }),

    // DCP = 3 field (only for category 2)
    is_pendrive_containing_hd_files: Joi.when('category', {
        is: 2,
        then: Joi.when('dcp', {
            is: 3,
            then: Joi.number().valid(1).required(),
            otherwise: Joi.optional()
        }),
        otherwise: Joi.optional()
    }),

    // Value field (required for both categories when category is 1 or 2)
    value_of_dcp_or_blueray: Joi.when('category', {
        is: Joi.valid(1, 2),
        then: Joi.number().min(1).required(),
        otherwise: Joi.optional()
    })
});

export default
    {
        entryFormSchema
    };
