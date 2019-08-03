import {  Field, ArgsType } from 'type-graphql';
import GroupWhereInput from '../inputs/groupWhere.input';

@ArgsType()
export default class GroupArgs {
    @Field(type => GroupWhereInput, { nullable: true})
    public where: GroupWhereInput;
}
