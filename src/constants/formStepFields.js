const STEP_FIELD_MAP = Object.freeze({
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
        'is_address_same_as_producer',
        // Return address fields (conditional)
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
        'director_name',
        'director_email',
        'director_mobile',
        'director_address',
        'director_indian_natinality',
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
        'is_directore_debute_film',
        'film_distribution_limited_to_india_only',
    ]),

    7: Object.freeze([
        'requisite_documents'
    ]),

    8: Object.freeze([]),
    
    9: Object.freeze([]),
});

export default STEP_FIELD_MAP;
