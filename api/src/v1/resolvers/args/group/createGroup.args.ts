import { Field, ArgsType, InputType } from 'type-graphql';

@InputType()
class CreateGroupInput {
    @Field()
    public tag: string;

    @Field()
    public color: string;

    @Field()
    public label: string;

    @Field()
    public hidden: boolean;
}

@ArgsType()
export default class CreateGroupArgs {
    @Field(type => CreateGroupInput)
    public data: CreateGroupInput;
}
