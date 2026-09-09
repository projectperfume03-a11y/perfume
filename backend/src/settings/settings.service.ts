import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Settings, SettingsDocument } from './settings.schema';

@Injectable()
export class SettingsService {
  constructor(@InjectModel(Settings.name) private readonly settingsModel: Model<SettingsDocument>) {}

  async get() { return (await this.settingsModel.findOne().lean()) || this.settingsModel.create({}); }

  update(payload: Partial<Settings>) { return this.settingsModel.findOneAndUpdate({}, payload, { new: true, upsert: true, setDefaultsOnInsert: true }).lean(); }
}
