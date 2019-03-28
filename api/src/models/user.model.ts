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
    public email: string;

    @Column(DataType.TEXT)
    public password: string;

    @Default(false)
    @Column(DataType.BOOLEAN)
    public admin: boolean;

    @Default(false)
    @Column(DataType.BOOLEAN)
    public verified: boolean;

    @Column(DataType.TEXT)
    public avatar: string;

    @ForeignKey(() => Group)
    @Column(DataType.NUMBER)
    public groupId: number;

    @BelongsTo(() => Group)
    public group: Group;
}
