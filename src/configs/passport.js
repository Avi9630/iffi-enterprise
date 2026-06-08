import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { config } from './config.js';
import { UserModel, AdminModel } from '../db/index.js';
import { TokenAudience, LifecycleStatus } from '../utils/enums.js';

const jwtOptions = {
    secretOrKey: config.jwt.secret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
    try {
        if (payload.type !== 'access') {
            return done(null, false);
        }

        // Admin tokens carry aud: 'admin' — look them up in the admins collection
        if (payload.aud === TokenAudience.ADMIN) {
            const admin = await AdminModel.findOne({ adminId: payload.sub })
                .select('adminId email name relationships profile lifecycle')
                .lean();
            if (!admin || admin.lifecycle?.status !== LifecycleStatus.ACTIVE) {
                return done(null, false);
            }
            return done(null, {
                _id: admin.adminId,
                adminId: admin.adminId,
                email: admin.email,
                name: admin.name,
                role: admin.profile?.role,
                theaterId: admin.relationships?.theaterId ?? null,
                audience: TokenAudience.ADMIN,
            });
        }

        // User audience — lookup by UUID userId, enforce active lifecycle
        const user = await UserModel.findOne({ userId: payload.sub, isArchived: false })
            .select('userId email name profile.phone profile.authProvider lifecycle.status')
            .lean();
        if (!user || user.lifecycle?.status !== LifecycleStatus.ACTIVE) {
            return done(null, false);
        }
        return done(null, {
            _id: user.userId,
            userId: user.userId,
            email: user.email,
            name: user.name,
            phone: user.profile?.phone,
            audience: TokenAudience.USER,
        });
    } catch (error) {
        return done(error, false);
    }
};

export const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);
