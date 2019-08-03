import { Op } from 'sequelize';
import { Resolver, Query, Args, Mutation, Authorized, Ctx } from 'type-graphql';

import { UserSchema } from '../schemas';
import { User, Group } from '../../models';

import UserArgs from './args/user/user.args';
import UsersArgs from './args/user/users.args';
import EditUserArgs from './args/user/editUser.args';
import DeleteUserArgs from './args/user/deleteUser.args';

import UserWhereInput from './args/inputs/userWhere.input';
import { GraphQLError } from 'graphql';

import { Context } from '../../@types/Context';

const parseWhere = (uwi: UserWhereInput) => {
    if (!uwi) return undefined;
    const where = JSON.parse(JSON.stringify(uwi));

    if (uwi.primaryGroup) {
        delete where.primaryGroup;

        where.primaryGroupId = uwi.primaryGroup.id;
    }

    return where;
};

@Resolver()
export default class UserResolver {

    // Query single user
    @Query(returns => UserSchema)
    public async user(@Args() { where }: UserArgs): Promise<UserSchema>  {
        const actualWhere = parseWhere(where);

        return await User.findOne({ where: actualWhere });
    }

    // Query all users
    @Query(returns => [UserSchema])
    public async users(@Args() { skip, limit, where }: UsersArgs): Promise<UserSchema[]> {
        const actualWhere = parseWhere(where);

        return await User.findAll({ limit, offset: skip, where: actualWhere });
    }

    // Edit user
    @Authorized('ADMIN', 'SELF')
    @Mutation(returns => UserSchema, { nullable: true })
    public async editUser(@Args() { id, data }: EditUserArgs, @Ctx() context: Context): Promise<UserSchema> {

        if (data.username) {
            const userWithSameUsername: User|null = await User.findOne({
                where: { username: { [Op.like]: data.username }, id: { [Op.not]: id } }
            });

            if (userWithSameUsername) {
                throw new GraphQLError(`'${data.username}' ist bereits vergeben`);
            }
        }

        const user: User|null = await User.findByPk(id);

        if (!user) return null;

        // make sure non admins cannot edit fields: admin, groups and primaryGroup
        if (!context.request.gradUser.admin) {
            if (data.admin !== undefined) delete data.admin;
            if (data.groups !== undefined) delete data.groups;
            if (data.primaryGroup !== undefined) delete data.primaryGroup;
        }

        if (data.primaryGroup) {
            const primaryGroup = await Group.findByPk(data.primaryGroup.id);
            if (primaryGroup) await user.$set('primaryGroup', primaryGroup);
        }

        if (data.groups) {
            const ids = data.groups.map(g => g.id);
            const groups = await Group.findAll({ where: { id: { [Op.in]: ids } } });
            await user.$set('groups', groups);
        }

        await user.update(data);

        return await User.findByPk(id);
    }

    // Delete user
    @Authorized('ADMIN', 'SELF')
    @Mutation(returns => UserSchema, { nullable: true })
    public async deleteUser(@Args() { id }: DeleteUserArgs): Promise<UserSchema> {
        const user: User|null = await User.findByPk(id);

        if (user) await user.destroy();

        return user;
    }
}
