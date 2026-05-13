class MasterHandler {
    async handler(type) {

        let data = null;

        switch (type) {

            case 'client_list':
                data = await ClientRepository.clientList();
                break;

            case 'ip_type_list':
                data = await CommonRepository.ipTypeList();
                break;

            case 'language_list':
                data = await CommonRepository.languageList();
                break;

            case 'genre':
                data = await CommonRepository.genreList();
                break;

            case 'country':
                data = await CommonRepository.countryList();
                break;

            case 'state':
                data = await CommonRepository.stateList(req.query.country_id);
                break;

            case 'city':
                data = await CommonRepository.cityList(req.query.state_id);
                break;

            default:
                return res.status(404).json({
                    success: false,
                    message: 'Invalid master data type'
                });

        }

    }
}

export default new MasterHandler ();