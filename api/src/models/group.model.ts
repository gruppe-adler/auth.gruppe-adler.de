import {
    Table,
    Column,
    Model,
    DataType,
    Unique,
    BelongsToMany,
    Default,
    PrimaryKey,
    AutoIncrement
} from 'sequelize-typescript';

import User from './user.model';
import UserGroup from './userGroup.model';

@Table({
    tableName: 'Groups'
})
export default class GroupsCollection extends Model<GroupsCollection> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    public id: number;

    @Unique
    @Column({
        type: DataType.TEXT,
        set(val: string) { this.setDataValue('tag', val.toLowerCase()); }
    })
    public tag: string;

    @Column({
        type: DataType.TEXT,
        set(val: string) { this.setDataValue('color', val.toUpperCase()); }
    })
    public color: string;

    @Column(DataType.TEXT)
    public label: string;

    @Default(false)
    @Column(DataType.BOOLEAN)
    public hidden: boolean;

    @BelongsToMany(() => User, () => UserGroup)
    public users: User[];
}
