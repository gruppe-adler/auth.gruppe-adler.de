import Group from './Group';

export default interface User {
    id: number;
    username: string;
    steamId: string;
    admin: boolean;
    avatar: string;
    groups: Group[];
    displayGroup: Group|null;
}
