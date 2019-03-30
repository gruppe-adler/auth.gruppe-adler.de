import { body, oneOf, param } from 'express-validator/check';
import { JwtService } from '../utils/JwtService';
import { return422 } from '../utils/return422';

export const GroupRules = {
    create: [
        JwtService.checkAdmin,
        body('tag')
            .exists().withMessage('Field \'tag\' is required'),
        body('color')
            .exists().withMessage('Field \'color\' is required')
            .custom((color => color.match(/^#([a-f0-9]{3}){1,2}$/i) !== null))
                .withMessage('Invalid format for field \'color\''),
        return422
    ],
    update: [
        JwtService.checkAdmin,
        // id of group to edit must be in param or in body
        oneOf([
            param('id').exists(),
            body('id').exists()
        ]),
        // either new tag or new color has to be given
        oneOf([
            body('tag').exists(),
            body('color').exists()
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
