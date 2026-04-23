export class Money {
  private readonly amount: number;

  constructor(amount: number) {
    if (amount < 0) throw new Error('Price cannot be negative');
    this.amount = Math.round(amount * 100) / 100; // Arredonda 2 casas
  }

  toNumber(): number {
    return this.amount;
  }

  multiply(factor: number): Money {
    return new Money(this.amount * factor);
  }

  add(other: Money): Money {
    return new Money(this.amount + other.amount);
  }

  toString(): string {
    return `R$ ${this.amount.toFixed(2)}`;
  }
}
