import { GradRequest } from './GradRequest';
import { Response } from 'express';

export interface Context {
    request: GradRequest;
    response: Response;
}
