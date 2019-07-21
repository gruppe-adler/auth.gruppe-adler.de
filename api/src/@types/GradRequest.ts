import { Request } from 'express';


export interface TokenPayload {
    username: string;
    avatar: string;
    admin: boolean;
    group: object;
}

export interface GradRequest extends Request {
    gradUser?: TokenPayload;
}
