import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './product.schema';

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private readonly productModel: Model<ProductDocument>) {}

  async findAll(query: Record<string, string>) {
    const page = Math.max(Number(query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(query.limit) || 20, 1), 100);
    const filter: Record<string, any> = { active: true, archived: false };
    if (query.gender) filter.gender = query.gender;
    if (query.category) filter.category = query.category;
    if (query.brand) filter.brand = query.brand;
    if (query.fragranceFamily) filter.fragranceFamily = query.fragranceFamily;
    if (query.search) filter.$text = { $search: query.search };
    if (query.minPrice || query.maxPrice) filter.price = { ...(query.minPrice && { $gte: Number(query.minPrice) }), ...(query.maxPrice && { $lte: Number(query.maxPrice) }) };
    const sort: Record<string, 1 | -1> = query.sort === 'price-low' ? { price: 1 } : query.sort === 'price-high' ? { price: -1 } : { createdAt: -1 };
    const [products, total] = await Promise.all([this.productModel.find(filter).sort(sort).skip((page - 1) * limit).limit(limit).lean(), this.productModel.countDocuments(filter)]);
    return { products, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findBySlug(slug: string) {
    const product = await this.productModel.findOne({ slug, active: true, archived: false }).lean();
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  create(payload: Partial<Product>) { return this.productModel.create(payload); }

  update(id: string, payload: Partial<Product>) { return this.productModel.findByIdAndUpdate(id, payload, { new: true, runValidators: true }).orFail(); }

  archive(id: string) { return this.productModel.findByIdAndUpdate(id, { active: false, archived: true }, { new: true }).orFail(); }

  remove(id: string) { return this.productModel.findByIdAndDelete(id).orFail(); }

  reserve(slug: string, quantity: number) { return this.productModel.findOneAndUpdate({ slug, stockType: 'limited', quantity: { $gte: quantity } }, { $inc: { quantity: -quantity } }, { new: true }).exec(); }
}
