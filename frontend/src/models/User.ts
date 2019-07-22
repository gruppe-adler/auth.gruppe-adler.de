import Group from './Group';

export default interface User {
    username: string;
    steamId: string;
    admin: boolean;
    avatar: string;
    groups: Group[];
}
