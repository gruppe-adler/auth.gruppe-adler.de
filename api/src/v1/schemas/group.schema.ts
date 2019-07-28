import { ObjectType, Field, Int } from 'type-graphql';

import UserSchema from './user.schema';

@ObjectType('Group')
export default class GroupSchema {
    @Field(type => Int)
    id: number;

    @Field(type => String, { description: 'The tag is the unique identifier of the group'})
    tag: string;
  
    @Field({ description: 'Color of the group as a hex' })
    color: string;

    @Field({ description: 'Display name of the group' })
    label: string;

    @Field()
    hidden: boolean;
}