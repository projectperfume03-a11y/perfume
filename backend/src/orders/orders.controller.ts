import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}
  @Post() create(@Body() body: { items: { productId: string; quantity: number }[]; shippingAddress: Record<string, string>; notes?: string; deliveryFee?: number }) { return this.ordersService.create(body); }
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() { return this.ordersService.findAll(); }
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) { return this.ordersService.findOne(id); }
  @Patch('bulk/status')
  @UseGuards(JwtAuthGuard)
  bulkStatus(@Body() body: { ids: string[]; orderStatus: string }) { return this.ordersService.bulkUpdateStatus(body.ids, body.orderStatus); }
  @Delete('bulk')
  @UseGuards(JwtAuthGuard)
  bulkRemove(@Body() body: { ids: string[] }) { return this.ordersService.bulkRemove(body.ids); }
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) { return this.ordersService.remove(id); }
  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  updateStatus(@Param('id') id: string, @Body() body: { orderStatus: string }) { return this.ordersService.updateStatus(id, body.orderStatus); }
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  updateDetails(@Param('id') id: string, @Body() body: { shippingAddress?: Record<string, string>; notes?: string; paymentStatus?: string }) { return this.ordersService.updateDetails(id, body); }
}
