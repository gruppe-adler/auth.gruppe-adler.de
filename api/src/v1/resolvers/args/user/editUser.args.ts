import { Field, ArgsType, Int, InputType } from 'type-graphql';
import UserGroupsInput from '../inputs/userGroup.input';

@InputType()
class EditUserInput {
    @Field({ nullable: true })
    username?: string;
    
    @Field({ nullable: true })
    steamId?: string;
    
    @Field({ nullable: true })
    avatar?: string;
  
    @Field({ nullable: true })
    admin?: boolean;

    @Field(type => [UserGroupsInput], { nullable: true })
    groups: UserGroupsInput[];

    @Field(type => UserGroupsInput, { nullable: true })
    primaryGroup: UserGroupsInput;
}

@ArgsType()
export default class EditUserArgs {
    @Field(type => Int)
    id: number;

    @Field(type => EditUserInput)
    data: EditUserInput;
}