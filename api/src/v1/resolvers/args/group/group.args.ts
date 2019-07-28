import {  Field, ArgsType, Int, InputType } from 'type-graphql';
import GroupWhereInput from '../inputs/groupWhere.input';

@ArgsType()
export default class GroupArgs {
    @Field(type => GroupWhereInput, { nullable: true})
    where: GroupWhereInput;
}