import logger from '../configs/logger.js';

export const errorMiddleware = (err, req, res, _next) => {

    const statusCode = err.statusCode ?? 500;
    const message = err.isOperational ? err.message : 'Internal server error';
    // const code = err.errorCode ?? 'internal_server_error';

    // console.log('From error middleware ----- Start');
    // console.log(statusCode);
    // console.log(message);
    // console.log(code);
    // console.log(err.isOperational);
    // console.log('From error middleware ----- End');

    if (!err.isOperational) {
        logger.error({ message: err.message, stack: err.stack, requestId: req.requestId });
    }

    res.status(statusCode).json({
        status: false,
        // status: statusCode,
        message,
        // code,
    });
};


// const errorHandler = (err, req, res, next) => {
//     err.statusCode = err.statusCode || 500;
//     err.status = err.status || 'error';

//     logger.error({
//         message: err.message,
//         stack: err.stack,
//         url: req.originalUrl,
//         method: req.method,
//         ip: req.ip,
//         userId: req.user?.id,
//     });

//     if (env.NODE_ENV === 'development') {
//         return res.status(err.statusCode).json({
//             status: false,
//             message: err.message,
//             stack: err.stack,
//             error: err,
//         });
//     }

//     if (err.isOperational) {
//         logger.error({ message: err.message, stack: err.stack });
//         return res.status(err.statusCode).json({
//             success: false,
//             message: err.message,
//         });
//     }

//     return res.status(500).json({
//         success: false,
//         message: 'Something went wrong!',
//     });
// };
// export default errorHandler;