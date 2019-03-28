import { Group } from './group.model';
import { Table, Column, Model, ForeignKey, BelongsTo, DataType, Default, Unique, DefaultScope } from 'sequelize-typescript';

@DefaultScope({
    attributes: { exclude: [ 'password', 'groupId' ] },
    include: [ () => Group ]
})
@Table
export class User extends Model<User> {
    @Unique
    @Column(DataType.TEXT)
    username: string;

    @Unique
    @Column(DataType.TEXT)
    email: string;
    
    @Column(DataType.TEXT)
    password: string;

    @Default(false)
    @Column(DataType.BOOLEAN)
    admin: boolean;

    @Default(false)
    @Column(DataType.BOOLEAN)
    verified: boolean;

    @Column(DataType.TEXT)
    avatar: string;

    @ForeignKey(() => Group)
    @Column(DataType.NUMBER)
    groupId: number;

    @BelongsTo(() => Group)
    group: Group;
}