import { body, oneOf, param } from 'express-validator/check';
import { User } from '../models/user.model';

import { JwtService } from '../utils/JwtService';
import { return422 } from '../utils/return422';

export const UserRules = {
    create: [
        JwtService.checkAdmin,
        body('verified')
            .not().exists(),
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
    ],
    update: [
        JwtService.checkAuthenticated,
        // id of user to edit must be in param or in body
        oneOf([
            param('id').exists(),
            body('id').exists()
        ]),
        // there has to be at least one value which should be updated
        oneOf([
            body('groupId').exists(),
            body('username').exists(),
            body('email').exists().isEmail(),
            body('password').exists(),
            body('avatar').exists(),
            body('admin').exists(),
            body('group').exists()
        ]),
        return422
    ],
    delete: [
        JwtService.checkAdmin,
        // id of group to edit must be in param or in body
        oneOf([
            param('id').exists(),
            body('id').exists()
        ]),
        return422
    ]
};
