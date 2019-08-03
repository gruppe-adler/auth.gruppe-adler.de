import {  Field, ArgsType, Int } from 'type-graphql';
import { Min } from 'class-validator';
import GroupWhereInput from '../inputs/groupWhere.input';

@ArgsType()
export default class GroupsArgs {
    @Field(type => Int, { defaultValue: 0 })
    @Min(0)
    public skip: number;

    @Field(type => Int, { nullable: true })
    @Min(1)
    public limit?: number;

    @Field(type => GroupWhereInput, { nullable: true})
    public where: GroupWhereInput;
}
