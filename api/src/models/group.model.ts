import { User } from './user.model';
import { Table, Column, Model, HasMany, DataType } from 'sequelize-typescript';

@Table
export class Group extends Model<Group> {
    @Column(DataType.TEXT)
    tag: string;
    
    @Column(DataType.TEXT)
    color: string;

    @HasMany(() => User)
    users: User[];
}