import { InputType, Field, Int } from 'type-graphql';

@InputType()
export default class UserGroupsInput {
    @Field(type => Int)
    public id: number;
}
