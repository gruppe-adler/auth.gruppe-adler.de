import { Group } from './group.model';
import {
    Table,
    Column,
    Model,
    ForeignKey,
    BelongsTo,
    DataType,
    Default,
    Unique,
    DefaultScope
} from 'sequelize-typescript';
import { fstat } from 'fs';

@DefaultScope({
    attributes: { exclude: [ 'password', 'groupId' ] },
    include: [ () => Group ]
})
@Table
export class User extends Model<User> {
    @Unique
    @Column(DataType.TEXT)
    public username: string;

    @Unique
    @Column(DataType.TEXT)
    public steamId: string;

    @Default(false)
    @Column(DataType.BOOLEAN)
    public admin: boolean;

    @Column(DataType.BLOB)
    public avatar: Buffer;

    @ForeignKey(() => Group)
    @Column(DataType.NUMBER)
    public groupId: number;

    @BelongsTo(() => Group)
    public group: Group;
}
