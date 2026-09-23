export const IP_FORM_STEPS = Object.freeze({
    FILM_DETAILS: 1,
    PRODUCERS_DETAILS: 2,
    DIRECTORS_DETAILS: 3,
    CREW_DETAILS: 4,
    CBFC_CERTIFICATION: 5,
    OTHER_DETAILS: 6,
    DOCUMENTS: 7,
    DECLARATION_PAYMENT: 8,
    SUBMISSION: 9
});

export const IP_DOCUMENT_TYPE = Object.freeze({
    PRODUCER_ID_PROOF: 1,
    DIRECTOR_ID_PROOF: 2,
    DECLARATION_CLAUSE_FILE: 3,
    FILE_CBFC_CERTIFICATE: 4,
    AUTHORIZATION_LATTER: 5,
    DECLARATION_LATTER: 6,
    SYNOPSIS_IN_ENGLISH: 7,
    DIRECTORS_PROFILE: 8,
    PRODUCERS_PROFILE: 9,
    DETAILS_OF_CAST_CREW: 10,
    GOV_ID_PROOF: 11,
    PASSPORT_IMAGE: 12,
    FIRST_GOV_ID_PROOF: 15,
    SECOND_GOV_ID_PROOF: 16,
    UPLOAD_CV: 17,
    UPLOAD_REEL: 18,
    CO_PRODUCER_ID_PROOF: 19,
    REQUISITE_DOCUMENTS: 20
});

export const IP_STEP_FIELD_MAP = Object.freeze({

    1: Object.freeze([
        'category',
        'title_of_film_in_roman',
        'title_of_film_in_devanagari',
        'english_translation_of_film',
        'title_of_script_langauge',
        'language_id',
        'whether_subtitle_english',
        'blueray',
        'pendrive',
        'dcp',
        'dci_compliant_jpeg_2000',
        'subtitle_to_be_burned_in_picture',
        'dcp_should_cru_hard_disk',
        'hard_disk_format_ext2_ext3',
        'is_dcp_unencrypted',
        'blueray_region_free_pal',
        'is_pendrive_containing_hd_files',
        'value_of_dcp_or_blueray'
    ]),

    2: Object.freeze([
        // 'step',
        'producer_is',
        'name_of_firm',
        'firm_is_owned_by_individual',
        'producer_email',
        'producer_landline',
        'producer_mobile',
        'producer_website',
        'producer_address',
        'company_is_registered_as_indian_entity',

        // Return address fields (conditional)
        'is_address_same_as_producer',
        'return_address_name',
        'return_address_email',
        'return_address_landline',
        'return_address_mobile',
        'return_address_fax',
        'return_address',

        // Right holder fields (conditional)
        'whether_indian_foreign_right_holder_same',
        'right_holder_name',
        'right_holder_email',
        'right_holder_landline',
        'right_holder_mobile',
        'right_holder_fax',
        'right_holder_address'
    ]),

    3: Object.freeze([
        // 'director_name',
        // 'director_email',
        // 'director_mobile',
        // 'director_address',
        // 'director_indian_natinality',
    ]),

    4: Object.freeze([
        'story_write_aurthor',
        'screenplay_script_write',
        'director_of_photography',
        'editor',
        'art_director',
        'costume_designer',
        'music_director',
        'sound_recordist',
        'sound_re_recordist',
        'principal_cast',
        'duration_running_time',
        'no_of_dcp_blueray',
        'color_b_w',
        'sound_system',
        'aspect_ratio',
    ]),

    5: Object.freeze([
        'film_is_certified_by_cbfc_or_uncensored',
        'date_of_cbfc_certificate',
        'certificate_no',
        'date_of_completion_production',
    ]),

    6: Object.freeze([
        'film_comletion_during_12month',
        'film_screened',
        'film_broadcast_tv',
        'film_screened_inside_india',
        'film_screened_outside_india',
        'film_participated_compentitaion',
        'is_ip_award',
        'film_distribution_limited_to_india_only',
        'is_directore_debute_film',
        'confirmation_neither_released_nor_planned',
        'enclosed_the_declaration_letter',
    ]),

    7: Object.freeze([
        'requisite_documents',
        'online_link',
        'online_password',
        'synopsis',
        'producer_note',
        'director_note',
    ]),

    8: Object.freeze([]),

    9: Object.freeze([]),
});

export const IP_STEP_DOCUMENT_MAP = Object.freeze({

    2: Object.freeze([
        {
            field: 'producer_id_proof',
            required: false,
            maxSize: 5 * 1024 * 1024, // 5 MB
            allowedMimeTypes: ['application/pdf'],
        },
    ]),

    3: Object.freeze([
        {
            field: 'director_id_proof',
            required: false,
            maxSize: 5 * 1024 * 1024, // 5 MB
            allowedMimeTypes: ['application/pdf'],
        },
    ]),

    // 4: Object.freeze([
    // {
    // field: 'file_cbfc_certificate',
    // required: true,
    // maxSize: 5 * 1024 * 1024,
    // allowedMimeTypes: ['application/pdf'],
    // },
    // {
    // field: 'declaration_clause_file',
    // required: false,
    // maxSize: 5 * 1024 * 1024,
    // allowedMimeTypes: ['application/pdf'],
    // },
    // {
    // field: 'uncensored_file',
    // required: false,
    // maxSize: 5 * 1024 * 1024,
    // allowedMimeTypes: ['application/pdf'],
    // }
    // ]),

    5: Object.freeze([
        {
            field: 'file_cbfc_certificate',
            required: false,
            maxSize: 5 * 1024 * 1024, // 5 MB
            allowedMimeTypes: ['application/pdf'],
        },
        
        {
            field: 'declaration_clause_file',
            required: false,
            maxSize: 5 * 1024 * 1024, // 5 MB
            allowedMimeTypes: ['application/pdf'],
        },

        // {
        //     field: 'uncensored_file',
        //     required: true,
        //     maxSize: 5 * 1024 * 1024, // 5 MB
        //     allowedMimeTypes: ['application/pdf'],
        // },
    ]),

    7: Object.freeze([
        {
            field: 'authorization_latter',
            required: false,
            // maxSize: 100 * 1024 * 1024, // 100 MB
            maxSize: 5 * 1024 * 1024, // 5 MB
            allowedMimeTypes: ['application/pdf'],
        },
        {
            field: 'declaration_latter',
            required: false,
            maxSize: 5 * 1024 * 1024, // 100 MB
            allowedMimeTypes: ['application/pdf'],
        },
        {
            field: 'synopsis_in_english',
            required: false,
            maxSize: 5 * 1024 * 1024, // 100 MB
            allowedMimeTypes: ['application/pdf'],
        },
        {
            field: 'directors_profile',
            required: false,
            maxSize: 5 * 1024 * 1024, // 100 MB
            allowedMimeTypes: ['application/pdf'],
        },
        {
            field: 'producers_profile',
            required: false,
            maxSize: 5 * 1024 * 1024, // 100 MB
            allowedMimeTypes: ['application/pdf'],
        },
        {
            field: 'details_of_cast_crew',
            required: false,
            maxSize: 5 * 1024 * 1024, // 100 MB
            allowedMimeTypes: ['application/pdf'],
        },
        {
            field: 'requisite_documents',
            required: false,
            maxSize: 5 * 1024 * 1024, // 100 MB
            allowedMimeTypes: ['application/pdf'],
        },
    ]),

});

// export const IP_STEP_DOCUMENT_MAP = Object.freeze({

// 1: Object.freeze([

// ]),

// 2: Object.freeze([
// 'producer_id_proof'
// ]),

// 3: Object.freeze([
// 'director_id_proof'
// ]),

// 4: Object.freeze([
// ]),

// 5: Object.freeze([
// 'file_cbfc_certificate',
// 'declaration_clause_file',
// 'uncensored_file',
// ]),

// 6: Object.freeze([

// ]),

// 7: Object.freeze([
// 'authorization_latter',
// 'declaration_latter',
// 'synopsis_in_english',
// 'directors_profile',
// 'producers_profile',
// 'details_of_cast_crew',
// 'requisite_documents'
// ]),

// 8: Object.freeze([]),

// 9: Object.freeze([]),
// });
