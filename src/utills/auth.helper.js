import AppError from "./AppError.js";

const RESEND_COOLDOWN_SECONDS = 60;

export const maskTarget = (type, target) => {
    if (type === 'EMAIL') return target.replace(/(.{2}).+(@.+)/, '$1***$2');
    return target.replace(/\d{6}(\d{4})/, '******$1');
};

export const getSecondsSince = (date) => (Date.now() - new Date(date).getTime()) / 1000;

export const assertResendCooldown = (createdAt) => {
    const elapsed = getSecondsSince(createdAt);
    if (elapsed < RESEND_COOLDOWN_SECONDS) {
        const wait = Math.ceil(RESEND_COOLDOWN_SECONDS - elapsed);
        throw new AppError(`Please wait ${wait}s before requesting a new OTP.`, 429);
    }
};

// module.exports = { maskTarget, assertResendCooldown };