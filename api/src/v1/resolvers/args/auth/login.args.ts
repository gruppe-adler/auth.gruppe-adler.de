import { Field, ArgsType } from 'type-graphql';

@ArgsType()
export default class LoginArgs {
    @Field(type => String)
    public url: string;
}
