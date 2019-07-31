import { Field, ArgsType, Int, InputType } from 'type-graphql';

@InputType()
class EditGroupInput {
    @Field({ nullable: true })
    public tag?: string;

    @Field({ nullable: true })
    public color?: string;

    @Field({ nullable: true })
    public label?: string;

    @Field({ nullable: true })
    public hidden?: boolean;
}

@ArgsType()
export default class EditGroupArgs {
    @Field(type => Int)
    public id: number;

    @Field(type => EditGroupInput)
    public data: EditGroupInput;
}
