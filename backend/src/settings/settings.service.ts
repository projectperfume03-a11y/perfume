import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Setting, SettingDocument } from './schemas/setting.schema';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(Setting.name) private settingModel: Model<SettingDocument>,
  ) {}

  async getSettings(): Promise<Setting> {
    let setting = await this.settingModel.findOne();
    if (!setting) {
      setting = await this.settingModel.create({ shippingCost: 7 });
    }
    return setting;
  }

  async updateSettings(dto: UpdateSettingsDto): Promise<Setting> {
    let setting = await this.settingModel.findOne();
    if (!setting) {
      return this.settingModel.create(dto);
    }
    setting.shippingCost = dto.shippingCost;
    return setting.save();
  }
}
