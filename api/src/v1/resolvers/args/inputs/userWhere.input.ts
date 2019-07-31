import {  Field, InputType, Int } from 'type-graphql';
import { UserSchema } from '../../../schemas';
import UserGroupsInput from './userGroup.input';

@InputType('UserWhereInput')
export default class UserWhereInput {

    @Field(type => Int, { nullable: true })
    public id?: number;

    @Field({ nullable: true })
    public username?: string;

    @Field({ nullable: true })
    public steamId?: string;

    @Field({ nullable: true })
    public avatar?: string;

    @Field({ nullable: true })
    public admin?: boolean;

    // @Field(type => [UserGroupsInput], { nullable: true })
    // groups?: UserGroupsInput;

    @Field(type => UserGroupsInput, { nullable: true })
    public primaryGroup?: UserGroupsInput;
}
