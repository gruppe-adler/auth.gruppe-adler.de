import { Field, ArgsType, Int, InputType } from 'type-graphql';

@InputType()
class EditGroupInput {
    @Field({ nullable: true })
    tag?: string;
  
    @Field({ nullable: true })
    color?: string;
    
    @Field({ nullable: true })
    label?: string;
    
    @Field({ nullable: true })
    hidden?: boolean;
}

@ArgsType()
export default class EditGroupArgs {
    @Field(type => Int)
    id: number;

    @Field(type => EditGroupInput)
    data: EditGroupInput;
}