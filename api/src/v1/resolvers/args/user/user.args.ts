import { Field, ArgsType } from 'type-graphql';
import UserWhereInput from '../inputs/userWhere.input';

@ArgsType()
export default class UserArgs {
    @Field(type => UserWhereInput, { nullable: true })
    public where?: UserWhereInput;
}
