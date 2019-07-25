import { body, oneOf, param, matchedData } from 'express-validator';
import { JwtService } from '../utils/JwtService';
import { return422 } from '../utils/return422';
import { Group } from '../models/group.model';
import { Op } from 'sequelize';

export const GroupRules = {
    create: [
        JwtService.checkAdmin,
        body('label')
            .exists().withMessage('Field \'label\' is required'),
        body('hidden').exists(),
        body('tag')
            .exists().withMessage('Field \'tag\' is required')
            .custom(async (tag, { req }) => {
                const payload = matchedData(req);
                const group = await Group.findOne({ where: { tag, id: { [Op.not]: payload.id } } });
                if (group !== null) throw new Error(`'${tag}' ist bereits vergeben.`);
                return true;
            }),
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
        body('tag')
            .optional()
            .custom(async (tag, { req }) => {
                const payload = matchedData(req);
                const group = await Group.findOne({ where: { tag, id: { [Op.not]: payload.id } } });
                if (group !== null) throw new Error(`'${tag}' ist bereits vergeben.`);
                return true;
            }),
        body('label').optional(),
        body('hidden').optional(),
        body('color').optional(),
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
