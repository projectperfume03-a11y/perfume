import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductsService } from '../products/products.service';
import { Order, OrderDocument } from './order.schema';

@Injectable()
export class OrdersService {
  constructor(@InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>, private readonly productsService: ProductsService) {}

  async create(payload: { items: { productId: string; quantity: number }[]; shippingAddress: Record<string, string>; notes?: string; deliveryFee?: number }) {
    if (!payload.items?.length) throw new BadRequestException('Order must contain at least one item');
    const items = await Promise.all(payload.items.map(async (line) => {
      const product = await this.productsService.findBySlug(line.productId).catch(() => null);
      if (!product || (product.stockType === 'limited' && product.quantity < line.quantity)) throw new BadRequestException(`Product ${line.productId} is unavailable`);
      if (product.stockType === 'limited' && !(await this.productsService.reserve(product.slug, line.quantity))) throw new BadRequestException(`Product ${line.productId} sold out during checkout`);
      return { productId: String(product._id), productName: product.name, image: product.images?.[0]?.url, quantity: line.quantity, unitPrice: product.price, subtotal: product.price * line.quantity };
    }));
    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const orderNumber = `PF-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
    return this.orderModel.create({ orderNumber, items, subtotal, deliveryFee: payload.deliveryFee || 0, total: subtotal + (payload.deliveryFee || 0), shippingAddress: payload.shippingAddress, notes: payload.notes });
  }

  findAll() { return this.orderModel.find().sort({ createdAt: -1 }).limit(100).lean(); }

  findOne(id: string) { return this.orderModel.findById(id).orFail().lean(); }

  updateStatus(id: string, orderStatus: string) { return this.orderModel.findByIdAndUpdate(id, { orderStatus }, { new: true, runValidators: true }).orFail(); }

  bulkUpdateStatus(ids: string[], orderStatus: string) { return this.orderModel.updateMany({ _id: { $in: ids } }, { $set: { orderStatus } }); }

  remove(id: string) { return this.orderModel.findByIdAndDelete(id).orFail(); }

  bulkRemove(ids: string[]) { return this.orderModel.deleteMany({ _id: { $in: ids } }); }

  updateDetails(id: string, payload: { shippingAddress?: Record<string, string>; notes?: string; paymentStatus?: string }) { return this.orderModel.findByIdAndUpdate(id, payload, { new: true, runValidators: true }).orFail(); }
}
