import { Group } from './group.model';
import { Table, Column, Model, ForeignKey, BelongsTo, DataType } from 'sequelize-typescript';

@Table
export class User extends Model<User> {
    @Column(DataType.TEXT)
    username: string;

    @Column(DataType.TEXT)
    email: string;
    
    @Column(DataType.TEXT)
    password: string;

    @Column(DataType.BOOLEAN)
    admin: boolean;

    @ForeignKey(() => Group)
    @Column(DataType.NUMBER)
    groupId: number;

    @BelongsTo(() => Group)
    group: Group;
}