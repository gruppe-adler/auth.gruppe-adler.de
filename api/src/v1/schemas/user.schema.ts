import { ObjectType, Field, Int } from 'type-graphql';

import { GroupSchema } from '.';

@ObjectType('User')
export default class UserSchema {
    @Field(type => Int)
    id: number;

    @Field()
    username: string;

    @Field()
    steamId: string;

    @Field()
    avatar: string;

    @Field()
    admin: boolean;

    @Field(type => [GroupSchema])
    groups: GroupSchema[];

    @Field(type => GroupSchema, { nullable: true })
    primaryGroup: GroupSchema;
}