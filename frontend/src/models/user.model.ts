import { Group } from './group.model';

export interface User {
    username: string;
    email: string;
    admin: boolean;
    verified: boolean;
    avatar: string;
    group: Group;
}
