import { Resolver, Query, Args, Mutation, Authorized } from 'type-graphql';
import { GroupSchema } from '../schemas';
import { Group } from '../../models';

import GroupArgs from './args/group/group.args';
import GroupsArgs from './args/group/groups.args';
import CreateGroupArgs from './args/group/createGroup.args';
import EditGroupArgs from './args/group/editGroup.args';
import DeleteGroupArgs from './args/group/deleteGroup.args';
import { Op } from 'sequelize';
import { GraphQLError } from 'graphql';

@Resolver()
export default class GroupResolver {

    // Query single group
    @Query(returns => GroupSchema, { nullable: true })
    public async group(@Args() { where }: GroupArgs): Promise<GroupSchema> {
        const actualWhere = where ? JSON.parse(JSON.stringify(where)) : undefined;

        return await Group.findOne({ where: actualWhere });
    }

    // Query all groups
    @Query(returns => [GroupSchema])
    public async groups(@Args() { skip, limit, where }: GroupsArgs): Promise<GroupSchema[]> {
        const actualWhere = where ? JSON.parse(JSON.stringify(where)) : undefined;

        return await Group.findAll({ limit, offset: skip, where: actualWhere });
    }

    // Create new group
    @Authorized('ADMIN')
    @Mutation(returns => GroupSchema)
    public async createGroup(@Args() { data }: CreateGroupArgs): Promise<GroupSchema> {

        const groupWithSameTag: Group|null = await Group.findOne({
            where: { tag: data.tag.toLowerCase() }
        });

        if (groupWithSameTag) {
            throw new GraphQLError(`'${data.tag}' ist bereits vergeben`);
        }

        return await Group.create(data);
    }

    // Edit group
    @Authorized('ADMIN')
    @Mutation(returns => GroupSchema, { nullable: true })
    public async editGroup(@Args() { id, data }: EditGroupArgs): Promise<GroupSchema> {

        if (data.tag) {
            const groupWithSameTag: Group|null = await Group.findOne({
                where: { tag: data.tag.toLowerCase(), id: { [Op.not]: id } }
            });

            if (groupWithSameTag) {
                throw new GraphQLError(`'${data.tag}' ist bereits vergeben`);
            }
        }

        const group: Group|null = await Group.findByPk(id);

        if (group) await group.update(data);

        return group;
    }

    // Delete group
    @Authorized('ADMIN')
    @Mutation(returns => GroupSchema, { nullable: true })
    public async deleteGroup(@Args() { id }: DeleteGroupArgs): Promise<GroupSchema> {
        const group: Group|null = await Group.findByPk(id);

        if (group) await group.destroy();

        return group;
    }
}
