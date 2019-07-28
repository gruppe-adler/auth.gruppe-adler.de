import {  Field, InputType, Int } from 'type-graphql';
import { UserSchema } from '../../../schemas';
import UserGroupsInput from './userGroup.input';

@InputType('UserWhereInput')
export default class UserWhereInput {
    
    @Field(type => Int, { nullable: true })
    id?: number;
    
    @Field({ nullable: true })
    username?: string;
    
    @Field({ nullable: true })
    steamId?: string;
    
    @Field({ nullable: true })
    avatar?: string;
  
    @Field({ nullable: true })
    admin?: boolean;
    
    // @Field(type => [UserGroupsInput], { nullable: true })
    // groups?: UserGroupsInput;
    
    @Field(type => UserGroupsInput, { nullable: true })
    primaryGroup?: UserGroupsInput;
}