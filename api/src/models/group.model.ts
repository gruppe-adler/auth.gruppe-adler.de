import { User } from './user.model';
import { UserGroup } from './user-group.model';
import { Table, Column, Model, HasMany, DataType, Unique, BelongsToMany, Default } from 'sequelize-typescript';

@Table
export class Group extends Model<Group> {
    @Unique
    @Column(DataType.TEXT)
    public tag: string;

    @Column(DataType.TEXT)
    public color: string;

    @Column(DataType.TEXT)
    public label: string;

    @Default(false)
    @Column(DataType.BOOLEAN)
    public hidden: boolean;

    @BelongsToMany(() => User, () => UserGroup)
    public users: User[];
}
