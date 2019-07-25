import { join } from 'path';
import { existsSync, mkdirSync, writeFileSync, unlinkSync } from 'fs';

const AVATAR_BASE_PATH = join(__dirname, '../../data/avatars');

// create directory if it doesn't exist already
if (!existsSync(AVATAR_BASE_PATH)) {
    mkdirSync(AVATAR_BASE_PATH);
}

export class AvatarService {

    public MAX_FILE_SIZE_BYTE = 100000; // 100 KB
    public ALLOWED_MIME_TYPES = [
        'image/gif',
        'image/jpeg',
        'image/png'
    ];

    /**
     * 
     */
    public static saveImage(buffer: Buffer, mimeType: string): string {
        
        const fileEnding = {
            'image/gif': 'gif',
            'image/jpeg': 'jpeg',
            'image/png': 'png'
        }[mimeType];

        // generate random name
        let name = this.randomName();
        while(existsSync(`${AVATAR_BASE_PATH}/${name}.${fileEnding}`)) name = this.randomName();

        writeFileSync(`${AVATAR_BASE_PATH}/${name}.${fileEnding}`, buffer);

        return `${name}.${fileEnding}`;
    }
    
    public static removeImage(name: string) {
        if(!existsSync(`${AVATAR_BASE_PATH}/${name}`)) return;

        unlinkSync(`${AVATAR_BASE_PATH}/${name}`);
    }

    private static randomName(): string {
        return (Math.random().toString(36).substr(2)) + (Math.random().toString(36).substr(2));
    }

    public maxSize
}