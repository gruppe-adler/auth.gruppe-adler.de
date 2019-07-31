import { Table, Column, Model, DataType, ForeignKey } from 'sequelize-typescript';

import User from './user.model';
import Group from './group.model';

@Table({
    tableName: 'UserGroups'
})
export default class UserGroup extends Model<UserGroup> {
    @ForeignKey(() => User)
    @Column(DataType.NUMBER)
    public userId: number;

    @ForeignKey(() => Group)
    @Column(DataType.NUMBER)
    public groupId: number;
}
