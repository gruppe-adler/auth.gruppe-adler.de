import { Request } from 'express';


export interface TokenPayload {
    id: number;
    username: string;
    // avatar: Buffer;
    admin: boolean;
    groups: object[];
}

export interface GradRequest extends Request {
    gradUser?: TokenPayload;
}
