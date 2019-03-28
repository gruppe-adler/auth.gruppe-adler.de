import { check } from 'express-validator/check';


export const VerificationRules = {
    verify: [
        check('code')
            .not().isEmpty()
    ]
};
