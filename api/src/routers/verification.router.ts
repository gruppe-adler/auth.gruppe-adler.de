import { Router, Request, Response } from 'express';
import { matchedData } from 'express-validator/filter';

import { VerificationRules } from '../rules/verification.rules';

import { wrapAsync } from '../utils/wrapAsync';
import { globalErrorHandler } from '../utils/globalErrorHandler';

// @ts-ignore
import { Verification } from '../models/verification.model';
import { User } from '../models/user.model';
import { endianness } from 'os';
import { EmailService } from '../utils/EmailService';

export const VerificationRouter = Router();

// GET verifies user
VerificationRouter.get('/verify', VerificationRules.verify, wrapAsync(async (req: Request, res: Response) => {
    const payload = matchedData(req);

    const verification = await Verification.findByPk(payload.code);

    if (verification === null) return res.status(404).end();

    await verification.user.update({ verified: true });

    Verification.destroy({ where: { userId: verification.user.id }});

    res.status(204).end();
}));

// POST resend verification email
VerificationRouter.post('/resend', VerificationRules.resend, wrapAsync(async (req: Request, res: Response) => {
    const payload = matchedData(req);

    const user = await User.findOne({ where: { email: payload.email } });

    if (user === null) return res.status(404).end();

    // user already verified
    if (user.verified) return res.status(204).end();

    // send new verification mail
    const verification: Verification = new Verification({ userId: user.id });
    await verification.save();
    EmailService.sendVerificationMail(user.email, verification.code);

    res.status(201).end();
}));

VerificationRouter.use(globalErrorHandler);
