import { body, oneOf, param } from 'express-validator/check'

export const GroupRules = {
    create: [
        body('tag')
            .exists().withMessage('Field \'tag\' is required'),
        body('color')
            .exists().withMessage('Field \'color\' is required')
            .custom((color => color.match(/^#([a-f0-9]{3}){1,2}$/i) !== null)).withMessage('Invalid format for field \'color\'')
    ],
    update: [
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
    ],
    delete: [
        // id of group to edit must be in param or in body
        oneOf([
            param('id').exists(),
            body('id').exists()
        ])
    ]
}
