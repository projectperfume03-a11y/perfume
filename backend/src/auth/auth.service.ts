import { Injectable, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { Admin } from './schemas/admin.schema';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectModel(Admin.name) private readonly adminModel: Model<Admin>,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async onModuleInit() {
    const username = this.config.get<string>('ADMIN_USERNAME') || 'admin';
    const password = this.config.get<string>('ADMIN_PASSWORD') || 'admin123';
    const exists = await this.adminModel.findOne({ username });
    if (!exists) {
      const hash = await bcrypt.hash(password, 10);
      await this.adminModel.create({ username, password: hash });
      console.log(`Administrateur "${username}" créé (définir mdp via .env).`);
    }
  }

  async login(username: string, password: string) {
    const admin = await this.adminModel.findOne({ username });
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      throw new UnauthorizedException('Identifiants incorrects');
    }
    const token = await this.jwt.signAsync({
      sub: admin._id,
      username: admin.username,
    });
    return { access_token: token, username: admin.username };
  }
}
