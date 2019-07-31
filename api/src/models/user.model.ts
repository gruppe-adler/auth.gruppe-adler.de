import {
    Table,
    Column,
    Model,
    DataType,
    Default,
    Unique,
    DefaultScope,
    BelongsToMany,
    ForeignKey,
    BelongsTo,
    PrimaryKey,
    AutoIncrement
} from 'sequelize-typescript';

import Group from './group.model';
import UserGroup from './userGroup.model';

@DefaultScope({
    include: [
        { model: () => Group, as: 'groups', through: { attributes: [] } },
        { model: () => Group, as: 'primaryGroup' }
    ]
})
@Table
export default class User extends Model<User> {

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    public id: number;

    @Unique
    @Column(DataType.TEXT)
    public username: string;

    @Unique
    @Column(DataType.TEXT)
    public steamId: string;

    @Column(DataType.TEXT)
    public avatar: string;

    @Default(false)
    @Column(DataType.BOOLEAN)
    public admin: boolean;

    @BelongsToMany(() => Group, { through: () => UserGroup, as: 'groups' })
    public groups: Group[];

    @ForeignKey(() => Group)
    @Column(DataType.INTEGER)
    public primaryGroupId: number;

    @BelongsTo(() => Group, { as: 'primaryGroup', foreignKey: 'primaryGroupId' })
    public primaryGroup: Group;
}
