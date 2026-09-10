import { Controller, Get, UseGuards } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('cloudinary')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Get('signature')
  @UseGuards(JwtAuthGuard)
  getSignature() {
    return this.cloudinaryService.getUploadSignature();
  }
}
