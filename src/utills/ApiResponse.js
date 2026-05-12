const ApiResponse = (res, statusCode, data) => {

    const sanitizedData = JSON.parse(
        JSON.stringify(data, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value
        )
    );

    return res.status(statusCode).json({
        success: statusCode < 400,
        ...sanitizedData
    });
};

export default ApiResponse;

// class ApiResponse {
//     static async successResponse(res, data = {}) {
//         // Sanitize data before sending
//         const sanitizedData = this.sanitizeBigInt(data.data);

//         const response = {
//             status: true,
//             message: data.message || 'Success',
//             data: sanitizedData
//         };

//         return res.status(data.statusCode || 200).json(response);
//     }

//     static async errorResponse(res, data = {}) {
//         const response = {
//             status: false,
//             message: data.message || 'Error occurred',
//             error: data.error || null
//         };

//         return res.status(data.statusCode || 500).json(response);
//     }

//     static sanitizeBigInt(obj) {
//         if (obj === null || obj === undefined) return obj;

//         return JSON.parse(
//             JSON.stringify(obj, (key, value) =>
//                 typeof value === 'bigint' ? value.toString() : value
//             )
//         );
//     }
// }

// export default ApiResponse;