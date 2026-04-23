import { Money } from '../value-objects/Money';

export class Product {
  constructor(
    public readonly id: number | null,
    public readonly storeId: number,
    public name: string,
    public description: string | null,
    private price: Money,
    public stockQuantity: number,
    public isActive: boolean,
    public images: string[],
    public readonly categoryId: number | null = null,
    public readonly createdAt: Date = new Date()
  ) {}

  getPrice(): Money {
    return this.price;
  }

  changePrice(newPrice: Money): void {
    this.price = newPrice;
  }

  hasStock(quantity: number = 1): boolean {
    return this.stockQuantity >= quantity;
  }

  decreaseStock(quantity: number = 1): void {
    if (!this.hasStock(quantity)) {
      throw new Error('Estoque insuficiente');
    }
    this.stockQuantity -= quantity;
  }

  increaseStock(quantity: number): void {
    this.stockQuantity += quantity;
  }
}
