import { Body, Controller, Post } from '@nestjs/common';
import { IsArray, IsNumber, IsString, Min, validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ProductsService } from '../products/products.service';

class CartLineDto { @IsString() productId!: string; @IsNumber() @Min(1) quantity!: number; }
class CalculateCartDto { @IsArray() items!: CartLineDto[]; @IsNumber() @Min(0) deliveryFee!: number; }

@Controller('cart')
export class CartController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('calculate')
  async calculate(@Body() body: CalculateCartDto) {
    const input = plainToInstance(CalculateCartDto, body);
    const errors = await validate(input);
    if (errors.length) return { message: 'Cart payload is invalid', errors };
    const lines = await Promise.all(input.items.map(async (item) => {
      const product = await this.productsService.findBySlug(item.productId).catch(() => null);
      if (!product) return null;
      return { productId: product._id, productName: product.name, quantity: item.quantity, unitPrice: product.price, subtotal: product.price * item.quantity, image: product.images?.[0]?.url };
    }));
    const validLines = lines.filter(Boolean) as { subtotal: number }[];
    const subtotal = validLines.reduce((sum, line) => sum + line.subtotal, 0);
    return { items: lines, subtotal, discount: 0, deliveryFee: input.deliveryFee, total: subtotal + input.deliveryFee };
  }
}
