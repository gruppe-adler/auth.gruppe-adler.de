import { Field, ArgsType, Int, InputType } from 'type-graphql';
import UserGroupsInput from '../inputs/userGroup.input';

@InputType()
class EditUserInput {
    @Field({ nullable: true })
    public username?: string;

    @Field({ nullable: true })
    public steamId?: string;

    @Field({ nullable: true })
    public avatar?: string;

    @Field({ nullable: true })
    public admin?: boolean;

    @Field(type => [UserGroupsInput], { nullable: true })
    public groups: UserGroupsInput[];

    @Field(type => UserGroupsInput, { nullable: true })
    public primaryGroup: UserGroupsInput;
}

@ArgsType()
export default class EditUserArgs {
    @Field(type => Int)
    public id: number;

    @Field(type => EditUserInput)
    public data: EditUserInput;
}
