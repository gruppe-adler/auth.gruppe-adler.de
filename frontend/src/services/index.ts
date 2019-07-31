import { User, Group } from '@/models';

const API_BASE_URL = 'https://sso.gruppe-adler.de/api/v1';

const fullGroupFragment = `
fragment fullGroup on Group {
    id
    tag
    color
    label
    hidden
}
`;

const fullUserFragment = `
fragment fullUser on User {
    id
    username
    steamId
    avatar
    admin
    groups { ...fullGroup }
    primaryGroup { ...fullGroup }
}

${fullGroupFragment}
`;

const sendGraphQL = async (query: string, variables: object = {}) => {
    const res = await fetch(`${API_BASE_URL}/graphql`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query,
            variables
        })
    });

    const body = await res.json();

    if (body.errors) throw body.errors;

    return body.data;
};

/**
 * Login via steam. Called in openid return.
 * @param {string} url BASE_URL + route + url params
 * @returns { Promise<void> } Promise resolves if successful
 */
export const logIn = async (url: string): Promise<void> => {
    await sendGraphQL(`mutation {login(url: "${url}")}`);
};

/**
 * Authenticate (= Check if user is logged in)
 * @returns { Promise<User> } Promise resolves into user.
 */
export const authenticate = async (): Promise<User> => {
    const data = await sendGraphQL(`
        mutation {
            authenticate { ...fullUser }
        }
        ${fullUserFragment}
    `);

    if (data.authenticate === null) throw new Error('not authenticated');

    return data.authenticate;
};

/**
 * Logout user (Clears the cookie)
 * @returns { Promise<void> } Promise resolves if successful
 */
export const logout = async (): Promise<void> => {
    await sendGraphQL(`mutation { logout }`);
};

/**
 * Fetch a single user
 * @returns { Promise<User> } Promise resolves into user.
 */
export const fetchUser = async (id: number): Promise<User> => {
    const data = await sendGraphQL(`
        query {
            user(where: { id: ${id} }) { ...fullUser }
        }
        ${fullUserFragment}
    `);

    return data.user;
};

/**
 * Fetch all users
 * @returns { Promise<User[]> } Promise resolves into array of users.
 */
export const fetchUsers = async (): Promise<User[]> => {
    const data = await sendGraphQL(`
        query {
            users { ...fullUser }
        }
        ${fullUserFragment}
    `);

    return data.users;
};

/**
 * Update a user
 * @param { User } user Object which includes all data
 * @returns { Promise<User> } Promise resolves into user.
 */
export const updateUser = async (user: User): Promise<User> => {

    const payload: any = { id: undefined, avatar: undefined };

    if (user.groups) payload.groups = user.groups.map(g => ({ id: g.id }));
    if (user.primaryGroup) payload.primaryGroup = { id: user.primaryGroup.id };

    const data = await sendGraphQL(`
        mutation($user: EditUserInput!) {
            editUser(id: ${user.id}, data: $user) { ...fullUser }
        }
        ${fullUserFragment}
    `, { user: { ...user, ...payload } });

    return data.editUser;
};

/**
 * Delete a user
 * @param { number } id Id of user
 * @returns { Promise<void> } Promise resolves if successful
 */
export const deleteUser = async (id: number): Promise<void> => {
    await sendGraphQL(`
        mutation {
            deleteUser(id: ${id}) { id }
        }
    `);
};

/**
 * Fetch a single group
 * @returns { Promise<Group> } Promise resolves into user.
 */
export const fetchGroup = async (id: number): Promise<Group> => {
    const data = await sendGraphQL(`
        query {
            group(where: { id: ${id} }) { ...fullGroup }
        }
        ${fullGroupFragment}
    `);

    return data.group;
};

/**
 * Fetch all groups
 * @returns { Promise<Group[]> } Promise resolves into array of groups.
 */
export const fetchGroups = async (): Promise<Group[]> => {
    const data = await sendGraphQL(`
        query {
            groups { ...fullGroup }
        }
        ${fullGroupFragment}
    `);

    return data.groups;
};

/**
 * Create a group
 * @param { Group } group Object which includes all data
 * @returns { Promise<Group> } Promise resolves into group.
 */
export const createGroup = async (group: Group): Promise<Group> => {
    const data = await sendGraphQL(`
        mutation($group: CreateGroupInput!) {
            createGroup(data: $group) { id }
        }
    `, { group: { ...group, id: undefined } });

    return data.createGroup;
};

/**
 * Update a group
 * @param { Group } group Object which includes all data
 * @returns { Promise<Group> } Promise resolves into group.
 */
export const updateGroup = async (group: Group): Promise<Group> => {
    const data = await sendGraphQL(`
        mutation($group: EditGroupInput!) {
            editGroup(id: ${group.id}, data: $group) { id }
        }
    `, { group: { ...group, id: undefined } });

    return data.editGroup;
};

/**
 * Delete a group
 * @param { number } id Id of group
 * @returns { Promise<void> } Promise resolves if successful
 */
export const deleteGroup = async (id: number): Promise<void> => {
    await sendGraphQL(`
        mutation {
            deleteGroup(id: ${id}) { id }
        }
    `);
};

/**
 * Update avatar of user
 * @param { File } file new avatar
 * @param { number } uid Id of user
 * @returns { Promise<void> } Promise resolves if successful
 */
export const updateAvatar = async (file: File, uid: number): Promise<void> => {
    const data = new FormData();
    data.append('avatar', file);

    const res = await fetch(`${API_BASE_URL}/upload/avatar/${uid}`, {
        method: 'PUT',
        credentials: 'include',
        body: data
    });

    if (!res.ok) throw res;
};
