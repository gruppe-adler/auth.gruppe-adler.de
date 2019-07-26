import { Router, Request, Response } from 'express';
import { matchedData } from 'express-validator';

import { Group } from '../models/group.model';
import { GroupRules } from '../rules/group.rules';

import { wrapAsync } from '../utils/wrapAsync';
import { globalErrorHandler } from '../utils/globalErrorHandler';

export const GroupRouter = Router();

// GET all groups
GroupRouter.get('/', wrapAsync(async (req: Request, res: Response) => {
    const groups: Group[] = await Group.findAll();

    res.status(200).json(groups);
}));

// GET single group
GroupRouter.get('/:id', wrapAsync(async (req: Request, res: Response) => {
    const group: Group|null = await Group.findByPk(req.params.id);

    if (group === null) throw { status: 404, message: `Group with id '${req.params.id}' not found`};

    res.status(200).json(group);
}));

// POST create a new group
GroupRouter.post('/', GroupRules.create, wrapAsync(async (req: Request, res: Response) => {
    const payload = matchedData(req);

    const group: Group = new Group(payload);
    await group.save();

    res.status(201).json(group);
}));

// PUT update a group
GroupRouter.put('/:id?', GroupRules.update, wrapAsync(async (req: Request, res: Response) => {
    const payload = matchedData(req);

    // find group to update
    let group: Group|null = await Group.findByPk(payload.id);

    // exit if group does not exist
    if (group === null) throw { status: 404, message: `Group with id '${payload.id}' not found`};

    // delete group
    delete payload.id;
    group = await group.update(payload);

    res.status(200).json(group);
}));

// DELETE a group
GroupRouter.delete('/:id?', GroupRules.delete, wrapAsync(async (req: Request, res: Response) => {
    const payload = matchedData(req);

    // find group to delete
    let group: Group|null = await Group.findByPk(payload.id);

    // exit if group does not exist
    if (group === null) throw { status: 404, message: `Group with id '${payload.id}' not found`};

    // delete group
    await group.destroy();

    res.status(204).end();
}));

// global error handler
GroupRouter.use(globalErrorHandler);
