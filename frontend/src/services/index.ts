import { User } from '@/models';

const API_BASE_URL = 'http://test.gruppe-adler.de:3000/api';

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
};

/**
 * Authenticate (= Check if user is logged in)
 * @returns { Promise<User> } Promise resolves into user.
 */
export const authenticate = async (): Promise<User> => {
    const res: Response = await fetch(`${API_BASE_URL}/authenticate`, {
        credentials: 'include',
        method: 'POST'
    });

    return await res.json();
};

/**
 * Fetch a single user
 * @returns { Promise<User> } Promise resolves into user.
 */
export const fetchUser = async (id: number): Promise<User> => {
    const res: Response = await fetch(`${API_BASE_URL}/user/${id}`, {
        method: 'POST'
    });

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

    await res.json();
};


