import { AuthChecker } from 'type-graphql';
import { Response } from 'express';
import { Context } from '../@types/Context';

export const customAuthChecker: AuthChecker<Context> = (
    { root, args, context, info },
    roles
) => {
    // return false if user is not authenticated
    if (! context.request.gradUser) return false;

    const user = context.request.gradUser;

    // grant access if can be accessed by any authorized user
    if (roles.length === 0) return true;

    // grant access if can be accessed by admin and user is admin
    if (roles.includes('ADMIN') && user.admin) return true;

    // grant access if can be accessed by self and user id matches
    if (roles.includes('SELF') && args.id === user.id) return true;

    // access is denied
    return false;
};
