import { Router, Request, Response } from 'express'
import { User } from '../models/user.model'
import { wrapAsync } from '../utils/wrapAsync';
import { globalErrorHandler } from '../utils/globalErrorHandler';
import { matchedData } from 'express-validator/filter';
import { validationResult } from 'express-validator/check';
import { UserRules } from '../rules/user.rules';

export const AuthRouter = Router()

AuthRouter.get('/', wrapAsync(async(req: Request, res: Response) => {

    let users: User[] = await User.findAll();

    res.status(200).json(users);
}));

AuthRouter.use(globalErrorHandler);
