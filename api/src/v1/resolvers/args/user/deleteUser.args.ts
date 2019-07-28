import { Field, ArgsType, Int } from 'type-graphql';

@ArgsType()
export default class DeleteUserArgs {
    @Field(type => Int)
    id: number;
}