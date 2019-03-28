import { User } from './user.model';
import { Table, Column, Model, HasMany, DataType } from 'sequelize-typescript';

@Table
export class Group extends Model<Group> {
    @Column(DataType.TEXT)
    public tag: string;

    @Column(DataType.TEXT)
    public color: string;

    @HasMany(() => User)
    public users: User[];
}
