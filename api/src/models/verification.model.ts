import * as uuid from 'uuid/v4';
import { User } from './user.model';
import {
    Table,
    Column,
    Model,
    DataType,
    BelongsTo,
    ForeignKey,
    DefaultScope,
    PrimaryKey,
    Default
} from 'sequelize-typescript';


@DefaultScope({
    attributes: { exclude: [ 'userId' ] },
    include: [ () => User ]
})
@Table
export class Verification extends Model<Verification> {
    @PrimaryKey
    @Default(() => uuid())
    @Column(DataType.UUIDV4)
    public code: string;

    @BelongsTo(() => User)
    public user: User[];

    @ForeignKey(() => User)
    @Column(DataType.NUMBER)
    public userId: number;
}
