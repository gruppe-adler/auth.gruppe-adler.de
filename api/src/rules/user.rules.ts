import { body, oneOf, param } from 'express-validator/check';
import { User } from '../models/user.model';

import { JwtService } from '../utils/JwtService';
import { return422 } from '../utils/return422';

export const UserRules = {
    update: [
        JwtService.checkAuthenticated,
        // id of user to edit must be in param or in body
        oneOf([
            param('id').exists(),
            body('id').exists()
        ]),
        // there has to be at least one value which should be updated
        oneOf([
            body('username').exists(),
            body('avatar').exists(),
            body('admin').exists(),
            body('groups').exists()
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
