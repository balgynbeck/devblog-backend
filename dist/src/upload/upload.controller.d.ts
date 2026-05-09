import { ConfigService } from "@nestjs/config";
export declare class UploadController {
    private config;
    constructor(config: ConfigService);
    uploadImage(file: Express.Multer.File): Promise<{
        url: any;
    }>;
}
