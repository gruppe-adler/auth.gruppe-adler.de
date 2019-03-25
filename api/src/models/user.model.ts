import { Group } from './group.model';
import { Table, Column, Model, ForeignKey, BelongsTo, DataType, Default } from 'sequelize-typescript';

@Table
export class User extends Model<User> {
    @Column(DataType.TEXT)
    username: string;

    @Column(DataType.TEXT)
    email: string;
    
    @Column(DataType.TEXT)
    password: string;

    @Default(false)
    @Column(DataType.BOOLEAN)
    admin: boolean;

    @Column(DataType.TEXT)
    avatar: string;

    @ForeignKey(() => Group)
    @Column(DataType.NUMBER)
    groupId: number;

    @BelongsTo(() => Group)
    group: Group;
}