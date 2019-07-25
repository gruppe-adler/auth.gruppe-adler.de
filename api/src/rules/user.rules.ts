import { body, oneOf, param } from 'express-validator';
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
        body('username')
            .isLength({ min: 5 }).withMessage('Nutzername muss mindestens 5 Zeichen lang sein')
            .custom(username => User.findOne({ where: { username } }).then(g => { if (g) return Promise.reject(`'${username}' ist bereits vergeben.`)})),
        body('avatar'),
        body('admin'),
        body('groups'),
        body('primaryGroup'),
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
