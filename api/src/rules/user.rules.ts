import * as multer from 'multer';

import { body, oneOf, param, matchedData } from 'express-validator';

import { sanitize } from 'express-validator';
import { User } from '../models/user.model';

import { JwtService } from '../utils/JwtService';
import { return422 } from '../utils/return422';
import { Op } from 'sequelize';

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
            .custom((username, { req }) => {
                const payload = matchedData(req);

                User.findOne({ where: { username, id: { [Op.not]: payload.id } } }).then(g => { if (g) return Promise.reject(`'${username}' ist bereits vergeben.`); });

                return Promise.resolve();
            }),
        body('avatar'),
        body('admin'),
        body('groups'),
        body('primaryGroup'),
        return422,
        JwtService.checkSelfOrAdmin
    ],
    avatar: [
        // id of user to edit must be in param or in body
        param('id').isInt(),
        sanitize('id').toInt(),
        return422,
        JwtService.checkSelfOrAdmin,
        multer({ storage: multer.memoryStorage() }).single('avatar')
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
