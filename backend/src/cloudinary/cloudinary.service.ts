import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class CloudinaryService {
  constructor(private readonly config: ConfigService) {}

  getUploadSignature() {
    const cloudName = this.config.get<string>('CLOUDINARY_CLOUD_NAME');
    const apiKey = this.config.get<string>('CLOUDINARY_API_KEY');
    const apiSecret = this.config.get<string>('CLOUDINARY_API_SECRET');
    const uploadPreset = this.config.get<string>('CLOUDINARY_UPLOAD_PRESET') || 'travail';
    const timestamp = Math.floor(Date.now() / 1000).toString();

    const params: Record<string, string> = { timestamp, upload_preset: uploadPreset };
    const toSign = Object.keys(params)
      .sort()
      .map((key) => `${key}=${params[key]}`)
      .join('&');

    const signature = crypto
      .createHash('sha1')
      .update(toSign + apiSecret)
      .digest('hex');

    return {
      cloud_name: cloudName,
      api_key: apiKey,
      timestamp,
      upload_preset: uploadPreset,
      signature,
    };
  }
}
