import { body, oneOf, check, header } from 'express-validator/check'

export const AuthRules = {
    login: [
        oneOf([
            body('email').exists(),
            body('username').exists()
        ]),
        body('password').exists(),
    ],
    authenticate: [
        oneOf([
            check('token')
                .exists(),
            header('Authorization')
                .exists()
                .custom((header => header.match(/^bearer\s+[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/i) !== null))
        ])
    ],
}
