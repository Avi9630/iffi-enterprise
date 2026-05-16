
class SanitizeHelper {

    async coProducerSanitize(data) {
        const sanitized = {};

        for (const [key, value] of Object.entries(data)) {
            if (value === undefined) continue;
            if ([
                'ip_application_form_id',
                'co_producer_is',
                'is_indian_entity',
            ].includes(key)) {
                sanitized[key] = value === null ? null : parseInt(value, 10);
            } else {
                sanitized[key] = value;
            }
        }

        return sanitized;
    }
}

export default new SanitizeHelper();