import { User, Group } from '@/models';

const API_BASE_URL = 'https://sso.gruppe-adler.de/api/v1';

/**
 * Login via steam. Called in openid return.
 * @param {string} url BASE_URL + route + url params
 * @returns { Promise<void> } Promise resolves if successful
 */
export const logIn = async (url: string): Promise<void> => {
    const res = await fetch(`${API_BASE_URL}/login/steam`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url })
    });

    if (!res.ok) throw res;
};

/**
 * Authenticate (= Check if user is logged in)
 * @returns { Promise<User> } Promise resolves into user.
 */
export const authenticate = async (): Promise<User> => {
    // console.trace();

    const res: Response = await fetch(`${API_BASE_URL}/authenticate`, {
        credentials: 'include',
        method: 'POST'
    });

    if (!res.ok) throw res;

    return await res.json();
};

/**
 * Logout user (Clears the cookie)
 * @returns { Promise<void> } Promise resolves if successful
 */
export const logout = async (): Promise<void> => {
    const res: Response = await fetch(`${API_BASE_URL}/logout`, {
        credentials: 'include',
        method: 'POST'
    });

    if (!res.ok) throw res;

    await res.json();
};

/**
 * Fetch a single user
 * @returns { Promise<User> } Promise resolves into user.
 */
export const fetchUser = async (id: number): Promise<User> => {
    const res: Response = await fetch(`${API_BASE_URL}/user/${id}`, {
        method: 'GET'
    });

    if (!res.ok) throw res;

    return await res.json();
};

/**
 * Fetch all users
 * @returns { Promise<User[]> } Promise resolves into array of users.
 */
export const fetchUsers = async (): Promise<User[]> => {
    const res: Response = await fetch(`${API_BASE_URL}/user`, {
        method: 'GET'
    });

    if (!res.ok) throw res;

    return await res.json();
};

/**
 * Update a group
 * @param { User } group Object which includes all data
 * @returns { Promise<User> } Promise resolves into user.
 */
export const updateUser = async (user: User): Promise<User> => {

    const body = {
        admin: user.admin,
        username: user.username,
        groups: user.groups,
        primaryGroup: user.primaryGroup
    };

    const res: Response = await fetch(`${API_BASE_URL}/user/${user.id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });

    if (!res.ok) throw res;

    return await res.json();
};

/**
 * Delete a group
 * @param { number } id Id of user
 * @returns { Promise<void> } Promise resolves if successful
 */
export const deleteUser = async (id: number): Promise<void> => {
    const res = await fetch(`${API_BASE_URL}/user/${id}`, {
        method: 'DELETE',
        credentials: 'include'
    });

    if (!res.ok) throw res;
};

/**
 * Fetch a single group
 * @returns { Promise<Group> } Promise resolves into user.
 */
export const fetchGroup = async (id: number): Promise<Group> => {
    const res: Response = await fetch(`${API_BASE_URL}/group/${id}`, {
        method: 'GET'
    });

    if (!res.ok) throw res;

    return await res.json();
};

/**
 * Fetch all groups
 * @returns { Promise<Group[]> } Promise resolves into array of groups.
 */
export const fetchGroups = async (): Promise<Group[]> => {
    const res: Response = await fetch(`${API_BASE_URL}/group`, {
        method: 'GET'
    });

    if (!res.ok) throw res;

    return await res.json();
};

/**
 * Create a group
 * @param { Group } group Object which includes all data
 * @returns { Promise<Group> } Promise resolves into group.
 */
export const createGroup = async (group: Group): Promise<Group> => {
    const body = {
        label: group.label,
        tag: group.tag,
        color: group.color,
        hidden: group.hidden
    };

    const res: Response = await fetch(`${API_BASE_URL}/group`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });

    if (!res.ok) throw res;

    return await res.json();
};

/**
 * Update a group
 * @param { Group } group Object which includes all data
 * @returns { Promise<Group> } Promise resolves into group.
 */
export const updateGroup = async (group: Group): Promise<Group> => {

    const body = {
        label: group.label,
        tag: group.tag,
        color: group.color,
        hidden: group.hidden
    };

    const res: Response = await fetch(`${API_BASE_URL}/group/${group.id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });

    return await res.json();
};

/**
 * Delete a group
 * @param { number } id Id of group
 * @returns { Promise<void> } Promise resolves if successful
 */
export const deleteGroup = async (id: number): Promise<void> => {
    const res = await fetch(`${API_BASE_URL}/group/${id}`, {
        method: 'DELETE',
        credentials: 'include'
    });

    if (!res.ok) throw res;
};

/**
 * Update avatar of user
 * @param { File } file new avatar
 * @param { number } uid Id of user
 * @returns { Promise<void> } Promise resolves if successful
 */
export const updateAvatar = async (file: File, uid: number): Promise<void> => {
    const data = new FormData();
    data.append('file', file);

    const res = await fetch(`${API_BASE_URL}/user/${uid}/avatar`, {
        method: 'PUT',
        body: file
    });

    if (!res.ok) throw res;
};
