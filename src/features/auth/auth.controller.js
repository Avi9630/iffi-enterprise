import catchAsync from '../../utills/catchAsync.js'

const register = async (req, resp) => {
    console.log('Welcome to register');
    return resp.json({
        success: true,
        message: 'Register API working'
    });
};

export default {
    register
};