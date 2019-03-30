import { Request } from 'express';


export interface TokenPayload {
    username: string;
    email: string;
    avatar: string;
    admin: boolean;
    group: object;
    verified: boolean;
}

export interface GradRequest extends Request {
    gradUser?: TokenPayload;
}
