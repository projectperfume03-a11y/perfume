import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ContactMessage, ContactMessageDocument } from './contact.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

class ContactDto { @IsString() @MinLength(2) name!: string; @IsString() phone!: string; @IsEmail() email!: string; @IsString() @MinLength(5) message!: string; }

@Controller('contact')
export class ContactController {
  constructor(@InjectModel(ContactMessage.name) private readonly contactModel: Model<ContactMessageDocument>) {}
  @Post() create(@Body() body: ContactDto) { return this.contactModel.create(body); }
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() { return this.contactModel.find().sort({ createdAt: -1 }).lean(); }
  @Patch(':id/read')
  @UseGuards(JwtAuthGuard)
  markRead(@Param('id') id: string) { return this.contactModel.findByIdAndUpdate(id, { status: 'read' }, { new: true }).orFail(); }
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) { return this.contactModel.findByIdAndDelete(id).orFail(); }
}
