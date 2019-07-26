import { Table, Column, Model, HasMany, DataType, ForeignKey } from 'sequelize-typescript';

import { User } from './user.model';
import { Group } from './group.model';

@Table
export class UserGroup extends Model<UserGroup> {
 
  @ForeignKey(() => User)
  @Column(DataType.NUMBER)
  userId: number;
 
  @ForeignKey(() => Group)
  @Column(DataType.NUMBER)
  groupId: number;
}