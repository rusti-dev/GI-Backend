import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { CloudinaryStorage } from 'multer-storage-cloudinary';



interface CustomParams {
    folder?: string;
    allowed_formats: string[];
    transformation: any[];
}

export const CloudinaryProvider = {
    provide: 'CLOUDINARY',
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
        return cloudinary.config({
            cloud_name: configService.get('CLOUDINARY_CLOUD_NAME'),
            api_key: configService.get('CLOUDINARY_API_KEY'),
            api_secret: configService.get('CLOUDINARY_API_SECRET'),
        });
    },
};

export const cloudinaryStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'inmuebles',
        allowed_formats: ['jpg', 'png', 'jpeg'],
        transformation: [{ width: 1000, height: 800, crop: 'limit' }],
    } as unknown as CustomParams,
});
