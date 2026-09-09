import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}
  @Get() get() { return this.settingsService.get(); }
  @Patch()
  @UseGuards(JwtAuthGuard)
  update(@Body() body: Record<string, unknown>) { return this.settingsService.update(body); }
}
