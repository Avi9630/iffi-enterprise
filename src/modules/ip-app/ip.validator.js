import Joi from "joi";
import { IP_FORM_STEPS } from "../../constants/index.js";

class IpValidator {

    entryFormSchema() {
        return Joi.object({

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

            blueray: Joi.number().integer().optional(),
            pendrive: Joi.number().integer().optional(),

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
    }

    filmDetailsSchema() {
        return Joi.object({

            step: Joi.number()
                .valid(IP_FORM_STEPS.FILM_DETAILS)
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

            blueray: Joi.number().integer().optional(),
            pendrive: Joi.number().integer().optional(),

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
    }

    producerDetailsSchema() {
        return Joi.object({

            step: Joi.number()
                .valid(IP_FORM_STEPS.PRODUCERS_DETAILS)
                .required(),

            producer_is: Joi.number()
                .valid(1, 2)
                .required(),

            name_of_firm: Joi.string()
                .trim()
                .required(),

            // Required only when producer_is = 1
            firm_is_owned_by_individual: Joi.when("producer_is", {
                is: 1,
                then: Joi.number()
                    .valid(0, 1)
                    .required(),
                otherwise: Joi.optional()
            }),

            producer_email: Joi.string()
                .email()
                .required(),

            producer_landline: Joi.string()
                .allow("", null),

            producer_mobile: Joi.string()
                .required(),

            producer_website: Joi.string()
                .allow("", null),

            producer_address: Joi.string()
                .required(),

            company_is_registered_as_indian_entity: Joi.number()
                .valid(1)
                .required(),

            is_address_same_as_producer: Joi.number()
                .valid(0, 1)
                .required(),

            // Return address fields required only when
            // is_address_same_as_producer = 0

            return_address_name: Joi.when("is_address_same_as_producer", {
                is: 0,
                then: Joi.string().required(),
                otherwise: Joi.optional()
            }),

            return_address_email: Joi.when("is_address_same_as_producer", {
                is: 0,
                then: Joi.string().email().required(),
                otherwise: Joi.optional()
            }),

            return_address_landline: Joi.string()
                .allow("", null),

            return_address_mobile: Joi.when("is_address_same_as_producer", {
                is: 0,
                then: Joi.string().required(),
                otherwise: Joi.optional()
            }),

            return_address_fax: Joi.string()
                .allow("", null),

            return_address: Joi.when("is_address_same_as_producer", {
                is: 0,
                then: Joi.string().required(),
                otherwise: Joi.optional()
            }),

            whether_indian_foreign_right_holder_same: Joi.number()
                .valid(0, 1)
                .required(),

            // Right holder fields required only when
            // whether_indian_foreign_right_holder_same = 0

            right_holder_name: Joi.when("whether_indian_foreign_right_holder_same", {
                is: 0,
                then: Joi.string().required(),
                otherwise: Joi.optional()
            }),

            right_holder_email: Joi.when("whether_indian_foreign_right_holder_same", {
                is: 0,
                then: Joi.string().email().required(),
                otherwise: Joi.optional()
            }),

            right_holder_landline: Joi.string()
                .allow("", null),

            right_holder_mobile: Joi.when("whether_indian_foreign_right_holder_same", {
                is: 0,
                then: Joi.string().required(),
                otherwise: Joi.optional()
            }),

            right_holder_fax: Joi.string()
                .allow("", null),

            right_holder_address: Joi.when("whether_indian_foreign_right_holder_same", {
                is: 0,
                then: Joi.string().required(),
                otherwise: Joi.optional()
            }),

            producer_id_proof: Joi.required()
        });
    }

    directorsDetailsSchema() {
        return Joi.object({

            step: Joi.number()
                .valid(IP_FORM_STEPS.DIRECTORS_DETAILS)
                .required(),

            director_name: Joi.string()
                .trim()
                .required(),

            director_email: Joi.string()
                .trim()
                .email()
                .required(),

            director_landline: Joi.string()
                .trim()
                .allow('', null),

            director_mobile: Joi.string()
                .trim()
                .required(),

            director_fax: Joi.string()
                .trim()
                .allow('', null),

            director_website: Joi.string()
                .trim()
                .uri()
                .allow('', null),

            director_address: Joi.string()
                .trim()
                .required(),

            director_indian_natinality: Joi.number()
                .valid(1)
                .required(),

            // director_id_proof: Joi.object().required()

            director_id_proof: Joi.object()
                .required()
                .custom((value, helpers) => {
                    const allowedTypes = [
                        'image/jpeg',
                        'image/png',
                        'application/pdf'
                    ];

                    if (!allowedTypes.includes(value.mimetype)) {
                        return helpers.message('Only JPG, PNG and PDF files are allowed');
                    }

                    if (value.size > 5 * 1024 * 1024) {
                        return helpers.message('File size must be less than 5 MB');
                    }

                    return value;
                })

        });
    }

    crewDetailsSchema() {
        return Joi.object({

            step: Joi.number()
                .valid(IP_FORM_STEPS.CREW_DETAILS)
                .required(),

            story_write_aurthor: Joi.string()
                .trim()
                .required(),

            screenplay_script_write: Joi.string()
                .trim()
                .required(),

            director_of_photography: Joi.string()
                .trim()
                .required(),

            editor: Joi.string()
                .trim()
                .required(),

            art_director: Joi.string()
                .trim()
                .required(),

            costume_designer: Joi.string()
                .trim()
                .allow('', null),

            music_director: Joi.string()
                .trim()
                .required(),

            sound_recordist: Joi.string()
                .trim()
                .allow('', null),

            sound_re_recordist: Joi.string()
                .trim()
                .allow('', null),

            principal_cast: Joi.string()
                .trim()
                .allow('', null),

            duration_running_time: Joi.string()
                .trim()
                .required(),

            no_of_dcp_blueray: Joi.string()
                .trim()
                .allow('', null),

            color_b_w: Joi.string()
                .trim()
                .required(),

            sound_system: Joi.string()
                .trim()
                .required(),

            aspect_ratio: Joi.string()
                .trim()
                .required(),
        });
    }

    cbfcCertificationSchema() {
        return Joi.object({

            step: Joi.number()
                .valid(IP_FORM_STEPS.CBFC_CERTIFICATION)
                .required(),

            film_is_certified_by_cbfc_or_uncensored: Joi.number()
                .valid(1, 2)
                .required(),

            // Required when value = 1
            date_of_cbfc_certificate: Joi.when(
                'film_is_certified_by_cbfc_or_uncensored',
                {
                    is: 1,
                    then: Joi.date()
                        .iso()
                        .required()
                        .messages({
                            'date.format': 'date_of_cbfc_certificate must be in YYYY-MM-DD format',
                            'date.base': 'date_of_cbfc_certificate must be a valid date'
                        }),
                    otherwise: Joi.optional()
                }
            ),

            certificate_no: Joi.when(
                'film_is_certified_by_cbfc_or_uncensored',
                {
                    is: 1,
                    then: Joi.string()
                        .trim()
                        .required(),
                    otherwise: Joi.optional()
                }
            ),

            // Required when value = 2
            date_of_completion_production: Joi.when(
                'film_is_certified_by_cbfc_or_uncensored',
                {
                    is: 2,
                    then: Joi.date()
                        .iso()
                        .required()
                        .messages({
                            'date.format': 'date_of_completion_production must be in YYYY-MM-DD format',
                            'date.base': 'date_of_completion_production must be a valid date'
                        }),
                    otherwise: Joi.optional()
                }
            ),

            // Optional file fields
            file_cbfc_certificate: Joi.any(),
            declaration_clause_file: Joi.any(),
            uncensored_file: Joi.any(),
        });
    }

    otherDetailsSchema() {
        return Joi.object({

            step: Joi.number()
                .valid(IP_FORM_STEPS.OTHER_DETAILS)
                .required(),

            film_comletion_during_12month: Joi.number()
                .valid(0, 1)
                .required(),

            film_screened: Joi.number()
                .required(),

            // Uncomment if needed
            /*
            name_of_festival: Joi.string().when('film_screened', {
                is: 1,
                then: Joi.required(),
                otherwise: Joi.optional()
            }),
        
            address_of_festival: Joi.string().when('film_screened', {
                is: 1,
                then: Joi.required(),
                otherwise: Joi.optional()
            }),
        
            date_of_festival: Joi.string().when('film_screened', {
                is: 1,
                then: Joi.date().format('YYYY-MM-DD').required(),
                otherwise: Joi.optional()
            }),
            */

            film_broadcast_tv: Joi.number()
                .valid(0, 1)
                .required(),

            film_screened_inside_india: Joi.number()
                .valid(0, 1)
                .required(),

            // Uncomment if needed
            /*
            date_of_release_india: Joi.string().when('film_screened_inside_india', {
                is: 1,
                then: Joi.date().format('YYYY-MM-DD').required(),
                otherwise: Joi.optional()
            }),
            */

            film_screened_outside_india: Joi.number()
                .required(),

            // Uncomment if needed
            /*
            name_of_country: Joi.string().when('film_screened_outside_india', {
                is: 1,
                then: Joi.required(),
                otherwise: Joi.optional()
            }),
        
            date_of_release_outside: Joi.string().when('film_screened_outside_india', {
                is: 1,
                then: Joi.date().format('YYYY-MM-DD').required(),
                otherwise: Joi.optional()
            }),
            */

            film_participated_compentitaion: Joi.number()
                .valid(0, 1)
                .required(),

            // Uncomment if needed
            /*
            name_of_compentitaion_festival: Joi.string().when('film_participated_compentitaion', {
                is: 1,
                then: Joi.required(),
                otherwise: Joi.optional()
            }),
            */

            is_directore_debute_film: Joi.number()
                .valid(0, 1)
                .required(),

            film_distribution_limited_to_india_only: Joi.number()
                .required()
        });
    }

    documentsSchema() {
        return Joi.object({

            step: Joi.number()
                .valid(IP_FORM_STEPS.DOCUMENTS)
                .required(),

            // Optional file fields
            authorization_latter: Joi.any(),
            declaration_latter: Joi.any(),
            synopsis_in_english: Joi.any(),
            directors_profile: Joi.any(),
            producers_profile: Joi.any(),
            details_of_cast_crew: Joi.any(),
        });
    }

    declarationPaymentSchema() {
        return Joi.object({

            step: Joi.number()
                .valid(IP_FORM_STEPS.DECLARATION_PAYMENT)
                .required(),
        });
    }

    submissionSchema() {
        return Joi.object({

            step: Joi.number()
                .valid(IP_FORM_STEPS.SUBMISSION)
                .required(),
        });
    }

    getSchemaForStep(step) {
        const schemas = {
            [IP_FORM_STEPS.FILM_DETAILS]: this.filmDetailsSchema(),
            [IP_FORM_STEPS.PRODUCERS_DETAILS]: this.producerDetailsSchema(),
            [IP_FORM_STEPS.DIRECTORS_DETAILS]: this.directorsDetailsSchema(),
            [IP_FORM_STEPS.CREW_DETAILS]: this.crewDetailsSchema(),
            [IP_FORM_STEPS.CBFC_CERTIFICATION]: this.cbfcCertificationSchema(),
            [IP_FORM_STEPS.OTHER_DETAILS]: this.otherDetailsSchema(),
            [IP_FORM_STEPS.DOCUMENTS]: this.documentsSchema(),
            [IP_FORM_STEPS.DECLARATION_PAYMENT]: this.declarationPaymentSchema(),
            [IP_FORM_STEPS.SUBMISSION]: this.submissionSchema(),
        };
        return schemas[step] || Joi.object();
    }
}

export default new IpValidator();