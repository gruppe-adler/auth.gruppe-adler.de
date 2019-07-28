import {  Field, ArgsType, Int, InputType } from 'type-graphql';
import { Min } from 'class-validator';
import GroupWhereInput from '../inputs/groupWhere.input';

@ArgsType()
export default class GroupsArgs {
    @Field(type => Int, { defaultValue: 0 })
    @Min(0)
    skip: number;

    @Field(type => Int, { nullable: true })
    @Min(1)
    limit?: number;

    @Field(type => GroupWhereInput, { nullable: true})
    where: GroupWhereInput;
}