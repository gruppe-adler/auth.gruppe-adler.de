import {  Field, InputType, Int } from 'type-graphql';
import { GroupSchema } from '../../../schemas';

@InputType('GroupWhereInput')
export default class GroupWhereInput implements Partial<GroupSchema> {
    @Field(type => Int, { nullable: true })
    id?: number;

    @Field({ nullable: true })
    tag?: string;
  
    @Field({ nullable: true })
    color?: string;
    
    @Field({ nullable: true })
    label?: string;
    
    @Field({ nullable: true })
    hidden?: boolean;
}