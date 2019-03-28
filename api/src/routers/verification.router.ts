import { Router, Request, Response } from 'express'
import { matchedData } from 'express-validator/filter';
import { validationResult } from 'express-validator/check';

import { VerificationRules } from '../rules/verification.rules';

import { wrapAsync } from '../utils/wrapAsync';
import { globalErrorHandler } from '../utils/globalErrorHandler';

// @ts-ignore
import { Verification } from '../models/verification.model';

export const VerificationRouter = Router()

// GET verifies user 
VerificationRouter.get('/verify', VerificationRules['verify'], wrapAsync(async(req: Request, res: Response) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json(errors.array());
    const payload = matchedData(req);

    const verification = await Verification.findByPk(payload.code);

    if (verification === null) return res.status(404).end();

    await verification.user.update({ verified: true });
    await verification.destroy();

    res.send(200).end();
}));

VerificationRouter.use(globalErrorHandler);
