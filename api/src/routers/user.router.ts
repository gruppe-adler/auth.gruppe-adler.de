import { Router, Request, Response } from 'express';
import { matchedData } from 'express-validator';

import { User } from '../models/user.model';
import { UserRules } from '../rules/user.rules';

import { wrapAsync } from '../utils/wrapAsync';
import { globalErrorHandler } from '../utils/globalErrorHandler';
import { GradRequest } from '../@types/GradRequest';
import { AvatarService } from '../utils/AvatarService';

export const UserRouter = Router();

// GET all users
UserRouter.get('/', wrapAsync(async (req: Request, res: Response) => {
    const users: User[] = await User.findAll();

    res.status(200).json(users);
}));

// GET single user
UserRouter.get('/:id', wrapAsync(async (req: Request, res: Response) => {
    const user: User|null = await User.findByPk(req.params.id);

    if (user === null) throw { status: 404, message: `User with id '${req.params.id}' not found`};

    res.status(200).json(user);
}));

// PUT update a user
UserRouter.put('/:id?', UserRules.update, wrapAsync(async (req: GradRequest, res: Response) => {
    const payload = matchedData(req);

    // find user to update
    let user: User|null = await User.findByPk(payload.id);

    // exit if user does not exist
    if (user === null) throw { status: 404, message: `User with id '${payload.id}' not found`};

    // update user
    delete payload.id;
    delete payload.avatar;
    if (!req.gradUser.admin && payload.admin !== undefined) delete payload.admin;
    if (!req.gradUser.admin && payload.groups !== undefined) delete payload.groups;

    user = await user.update(payload);

    // @ts-ignore
    if (payload.groups)await user.setGroups(payload.groups.map(g => g.id));

    // @ts-ignore
    if (payload.primaryGroup)await user.setPrimaryGroup(payload.primaryGroup.id);

    res.status(200).json(user);
}));

// PUT update a user avatar
UserRouter.put('/:id/avatar', UserRules.avatar, wrapAsync(async (req: GradRequest, res: Response) => {
    const payload = matchedData(req);

    // find user to update
    let user: User|null = await User.findByPk(payload.id);

    // exit if user does not exist
    if (user === null) throw { status: 404, message: `User with id '${payload.id}' not found`};

    // delete old avatar
    AvatarService.removeImage(user.avatar);

    const avatar = AvatarService.saveImage(req.body, req.headers["content-type"]);

    user = await user.update({ avatar });

    res.status(200).json(user);
}));

// DELETE a user
UserRouter.delete('/:id?', UserRules.delete, wrapAsync(async (req: Request, res: Response) => {
    const payload = matchedData(req);

    // find user to delete
    let user: User|null = await User.findByPk(payload.id);

    // exit if user does not exist
    if (user === null) throw { status: 404, message: `User with id '${payload.id}' not found`};

    // delete user
    await user.destroy();

    res.status(204).end();
}));

// global error handler
UserRouter.use(globalErrorHandler);
