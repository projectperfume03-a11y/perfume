import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(@Query() query: Record<string, string>) { return this.productsService.findAll(query); }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) { return this.productsService.findBySlug(slug); }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() body: Record<string, unknown>) { return this.productsService.create(body); }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() body: Record<string, unknown>) { return this.productsService.update(id, body); }

  @Patch(':id/archive')
  @UseGuards(JwtAuthGuard)
  archive(@Param('id') id: string) { return this.productsService.archive(id); }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) { return this.productsService.remove(id); }
}
