import { body } from 'express-validator';


// @ts-ignore
import { JwtService } from '../utils/JwtService';
import { return422 } from '../utils/return422';

export const AuthRules = {
    authenticate: [
        JwtService.checkAuthenticated
    ],
    login: [
        body('url').exists(),
        return422
    ]
};
