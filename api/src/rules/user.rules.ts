import { body, oneOf, param } from 'express-validator/check';
import { sanitize } from 'express-validator';
import { User } from '../models/user.model';

import { JwtService } from '../utils/JwtService';
import { return422 } from '../utils/return422';

export const UserRules = {
    update: [
        // id of user to edit must be in param or in body
        oneOf([
            param('id').isInt(),
            body('id').isInt()
        ]),
        sanitize('id').toInt(),
        oneOf([
            body('username')
                .exists()
                .isLength({ min: 5 })
                .withMessage('username is too short')
                .custom(username => User.findOne({ where: { username } }).then(u => !!!u))
                .withMessage('username already exists'),
            body('avatar').exists(),
            body('admin').exists(),
            body('groups').exists(),
            body('primaryGroup').exists()
        ]),
        return422,
        JwtService.checkSelfOrAdmin
    ],
    delete: [
        // id of group to edit must be in param or in body
        oneOf([
            param('id').exists(),
            body('id').exists()
        ]),
        sanitize('id').toInt(),
        return422,
        JwtService.checkSelfOrAdmin
    ]
};
