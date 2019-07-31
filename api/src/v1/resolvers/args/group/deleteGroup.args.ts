import { Field, ArgsType, Int } from 'type-graphql';

@ArgsType()
export default class DeleteGroupArgs {
    @Field(type => Int)
    public id: number;
}
