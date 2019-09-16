import * as multer from 'multer';

import { Router, Response } from 'express';
import { wrapAsync } from '../utils/wrapAsync';
import { GradRequest } from '../@types/GradRequest';
import { JwtService } from '../utils/JwtService';
import { User } from '../models';
import { AvatarService } from '../utils/AvatarService';
import { globalErrorHandler } from '../utils/globalErrorHandler';


export const AvatarRouter = Router();

interface AvatarRequest extends GradRequest {
    file?: { buffer: Buffer, mimetype: string, size: number };
}

// PUT update a user avatar
AvatarRouter.put('/upload/avatar/:id', [
    multer({ storage: multer.memoryStorage() }).single('avatar')
], wrapAsync(async (req: AvatarRequest, res: Response) => {
    const id = Number.parseInt(req.params.id, 10);

    if (Number.isNaN(id)) throw { status: 422, message: 'id is not a number' };

    JwtService.checkSelfOrAdmin(id)(req, res, async () => {
        try {

            if (!req.file) throw { status: 400, message: 'no file given' };

            if (req.file.size > 1000001) throw { status: 422, message: 'File size mustn\'t exceed 1MB' };

            // find user to update
            let user: User|null = await User.findByPk(id);

            // exit if user does not exist
            if (user === null) throw { status: 404, message: `User with id '${id}' not found`};

            // delete old avatar
            AvatarService.removeImage(user.avatar);

            const avatar = AvatarService.saveImage(req.file.buffer as Buffer, req.file.mimetype);

            user = await user.update({ avatar });

            res.status(200).json({ avatar });
        } catch (err) {
            globalErrorHandler(err, req, res, undefined);
        }

    });
}));

AvatarRouter.use(globalErrorHandler);
