import { Group } from './group.model';
import {
    Table,
    Column,
    Model,
    DataType,
    Default,
    Unique,
    DefaultScope,
    BelongsToMany
} from 'sequelize-typescript';
import { UserGroup } from './user-group.model';

@DefaultScope({
    attributes: { exclude: [ 'avatar' ] },
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

    @BelongsToMany(() => Group, () => UserGroup)
    public groups: Group[];
}
