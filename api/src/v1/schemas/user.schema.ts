import { ObjectType, Field, Int } from 'type-graphql';

import { GroupSchema } from '.';

@ObjectType('User')
export default class UserSchema {
    @Field(type => Int)
    public id: number;

    @Field()
    public username: string;

    @Field()
    public steamId: string;

    @Field()
    public avatar: string;

    @Field()
    public admin: boolean;

    @Field(type => [GroupSchema])
    public groups: GroupSchema[];

    @Field(type => GroupSchema, { nullable: true })
    public primaryGroup: GroupSchema;
}
