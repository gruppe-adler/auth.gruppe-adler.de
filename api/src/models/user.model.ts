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
    AutoIncrement,
} from 'sequelize-typescript';

import Group from './group.model';
import UserGroup from './userGroup.model';

@DefaultScope({
    attributes: { exclude: [ 'primaryGroupId' ] },
    include: [ 
        { model: () => Group, as: 'groups', through: { attributes: [] } },
        { model: () => Group, as: 'primaryGroup' }
    ]
})
@Table({
    tableName: 'Users'
})
export default class User extends Model<User> {
    
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.NUMBER)
    id: number;

    @Unique
    @Column(DataType.TEXT)
    username: string;

    @Unique
    @Column(DataType.TEXT)
    steamId: string;

    @Column(DataType.TEXT)
    avatar: string;

    @Default(false)
    @Column(DataType.BOOLEAN)
    admin: boolean;

    @BelongsToMany(() => Group, { through: () => UserGroup, as: 'groups' })
    groups: Group[];

    @BelongsTo(() => Group, { as: 'primaryGroup', foreignKey: 'primaryGroupId' })
    primaryGroup: Group;
    
    @ForeignKey(() => Group)
    @Column(DataType.NUMBER)
    public primaryGroupId: number;
}