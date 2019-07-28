import { Field, ArgsType, Int, InputType } from 'type-graphql';

@InputType()
class CreateGroupInput {
    @Field()
    tag: string;
  
    @Field()
    color: string;
    
    @Field()
    label: string;
    
    @Field()
    hidden: boolean;
}

@ArgsType()
export default class CreateGroupArgs {
    @Field(type => CreateGroupInput)
    data: CreateGroupInput;
}