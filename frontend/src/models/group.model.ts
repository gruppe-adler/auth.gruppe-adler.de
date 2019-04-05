import { User } from './user.model';

export interface Group {
    tag: string;
    color: string;
    users: User[];
}
