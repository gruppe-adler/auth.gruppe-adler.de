import { ObjectType, Field, Int } from 'type-graphql';

import UserSchema from './user.schema';

@ObjectType('Group')
export default class GroupSchema {
    @Field(type => Int)
    public id: number;

    @Field(type => String, { description: 'The tag is the unique identifier of the group'})
    public tag: string;

    @Field({ description: 'Color of the group as a hex' })
    public color: string;

    @Field({ description: 'Display name of the group' })
    public label: string;

    @Field()
    public hidden: boolean;
}
