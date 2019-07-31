import {  Field, InputType, Int } from 'type-graphql';
import { GroupSchema } from '../../../schemas';

@InputType('GroupWhereInput')
export default class GroupWhereInput implements Partial<GroupSchema> {
    @Field(type => Int, { nullable: true })
    public id?: number;

    @Field({ nullable: true })
    public tag?: string;

    @Field({ nullable: true })
    public color?: string;

    @Field({ nullable: true })
    public label?: string;

    @Field({ nullable: true })
    public hidden?: boolean;
}
