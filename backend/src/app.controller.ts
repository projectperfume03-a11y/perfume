import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(private config: ConfigService) {}

  @Get('health')
  health() {
    return {
      status: 'ok',
      app: 'ROYA API',
      cloudinary: this.config.get('CLOUDINARY_CLOUD_NAME'),
    };
  }
}
