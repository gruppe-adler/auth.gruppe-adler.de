import { body, oneOf, check, header } from 'express-validator/check';


// @ts-ignore
import { config } from 'config';
import { User } from '../models/user.model';
import { return422 } from '../utils/return422';

export const AuthRules = {
    login: [
        oneOf([
            body('email').exists(),
            body('username').exists()
        ]),
        body('password').exists(),
        return422
    ],
    authenticate: [
        oneOf([
            check(config.cookie.name)
                .exists(),
            header('Authorization')
                .exists()
                .custom((h => h.match(/^bearer\s+[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/i) !== null))
        ]),
        return422
    ],
    register: [
        body('verified')
            .not().exists().withMessage('Cannot set field \'verified\' on register endpoint.'),
        body('admin')
            .not().exists().withMessage('Cannot set field \'admin\' on register endpoint.'),
        body('username')
            .exists().withMessage('Field \'username\' is required')
            .isLength({ min: 5 }).withMessage('Field \'username\' is too short')
            .custom(username => User.findOne({ where: { username } }).then(u => !!!u)).withMessage('Username exists'),
        body('email')
            .exists().withMessage('Field \'email\' is required')
            .isEmail().withMessage('Invalid format for field \'email\'')
            .custom(email => User.findOne({ where: { email } }).then(u => !!!u)).withMessage('Email already exists'),
        body('password')
            .exists().withMessage('Field \'password\' is required')
            .not().isEmpty().withMessage('Field \'password\' is required'),
        body('avatar')
            .exists().withMessage('Field \'admin\' is required'),
        return422
    ]
};
