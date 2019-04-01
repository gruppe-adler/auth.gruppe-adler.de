import { check } from 'express-validator/check';
import { return422 } from '../utils/return422';


export const VerificationRules = {
    verify: [
        check('code')
            .not().isEmpty(),
        return422
    ],
    resend: [
        check('email')
            .not().isEmpty(),
        return422
    ],
    return422
};
