import { Group } from './group.model';
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
} from 'sequelize-typescript';
import { UserGroup } from './user-group.model';

@DefaultScope({
    attributes: { exclude: [ 'primaryGroupId' ] },
    include: [ 
        { model: () => Group, as: 'groups', through: { attributes: [] } },
        { model: () => Group, as: 'primaryGroup' }
    ]
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

    @Column(DataType.TEXT)
    public avatar: string;

    @BelongsToMany(() => Group, { through: () => UserGroup, as: 'groups' })
    public groups: Group[];

    @ForeignKey(() => Group)
    @Column(DataType.NUMBER)
    public primaryGroupId: number;
    
    @BelongsTo(() => Group, { as: 'primaryGroup', foreignKey: 'primaryGroupId' })
    public primaryGroup: Group;
}
