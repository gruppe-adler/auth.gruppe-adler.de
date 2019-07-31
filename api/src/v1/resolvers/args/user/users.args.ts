import { Field, ArgsType, Int } from 'type-graphql';
import { Min } from 'class-validator';
import UserWhereInput from '../inputs/userWhere.input';

@ArgsType()
export default class UsersArgs {
    @Field(type => Int, { defaultValue: 0 })
    @Min(0)
    public skip: number;

    @Field(type => Int, { nullable: true })
    @Min(1)
    public limit?: number;

    @Field(type => UserWhereInput, { nullable: true })
    public where?: UserWhereInput;
}
