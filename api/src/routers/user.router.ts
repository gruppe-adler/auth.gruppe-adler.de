import { Router, Request, Response } from 'express';
import { validationResult } from 'express-validator/check';
import { matchedData } from 'express-validator/filter';

import { User } from '../models/user.model';
import { UserRules } from '../rules/user.rules';

import { wrapAsync } from '../utils/wrapAsync';
import { globalErrorHandler } from '../utils/globalErrorHandler';

export const UserRouter = Router();

UserRouter.get('/', wrapAsync(async (req: Request, res: Response) => {
    const users: User[] = await User.findAll();

    res.status(200).json(users);
}));

UserRouter.get('/:id', wrapAsync(async (req: Request, res: Response) => {
    const user: User|null = await User.findByPk(req.params.id);

    if (user === null) return res.status(404).end();

    res.status(200).json(user);
}));


// POST create a new user
UserRouter.post('/', UserRules.create, wrapAsync(async (req: Request, res: Response) => {
    const payload = matchedData(req);

    const user: User = new User(payload);
    await user.save();

    res.status(201).json(user);
}));

// PUT update a user
UserRouter.put('/:id?', UserRules.update, wrapAsync(async (req: Request, res: Response) => {
    const payload = matchedData(req);

    // find user to update
    let user: User|null = await User.findByPk(payload.id);

    // exit if user does not exist
    if (user === null) return res.status(404).end();

    // update user
    delete payload.id;
    user = await user.update(payload);

    res.status(200).json(user);
}));

// DELETE a user
UserRouter.delete('/:id?', UserRules.delete, wrapAsync(async (req: Request, res: Response) => {
    const payload = matchedData(req);

    // find user to delete
    let user: User|null = await User.findByPk(payload.id);

    // exit if user does not exist
    if (user === null) return res.status(404).end();

    // delete user
    user = await user.destroy();

    res.status(200).json();
}));

// global error handler
UserRouter.use(globalErrorHandler);
