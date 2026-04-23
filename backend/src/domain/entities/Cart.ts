export class CartItem {
  constructor(
    public readonly id: number | null,
    public readonly userId: number,
    public readonly productId: number,
    public readonly storeId: number,
    public quantity: number,
    public readonly addedAt: Date = new Date()
  ) {}

  increment(amount: number = 1): void {
    this.quantity += amount;
  }

  updateQuantity(newQuantity: number): void {
    if (newQuantity <= 0) {
      throw new Error('Quantity must be greater than zero');
    }
    this.quantity = newQuantity;
  }
}
