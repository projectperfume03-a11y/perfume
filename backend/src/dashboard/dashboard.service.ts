import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from '../orders/order.schema';
import { Product, ProductDocument } from '../products/product.schema';
import { ContactMessage, ContactMessageDocument } from '../contact/contact.schema';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    @InjectModel(Product.name) private readonly productModel: Model<ProductDocument>,
    @InjectModel(ContactMessage.name) private readonly contactModel: Model<ContactMessageDocument>,
  ) {}

  async overview() {
    const [products, orders, revenue, statuses, lowStock, newMessages, recentOrders] = await Promise.all([
      this.productModel.countDocuments({ active: true, archived: false }),
      this.orderModel.countDocuments(),
      this.orderModel.aggregate([{ $match: { orderStatus: { $ne: 'cancelled' } } }, { $group: { _id: null, total: { $sum: '$total' } } }]),
      this.orderModel.aggregate([{ $group: { _id: '$orderStatus', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
      this.productModel.find({ active: true, archived: false, stockType: 'limited', $expr: { $lte: ['$quantity', '$lowStockThreshold'] } }).select('name quantity lowStockThreshold images').sort({ quantity: 1 }).limit(8).lean(),
      this.contactModel.countDocuments({ status: 'new' }),
      this.orderModel.find().sort({ createdAt: -1 }).limit(5).select('orderNumber total orderStatus shippingAddress createdAt').lean(),
    ]);
    return { products, orders, revenue: revenue[0]?.total || 0, statuses, lowStock, newMessages, recentOrders };
  }
}
