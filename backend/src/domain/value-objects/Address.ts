export class Address {
  constructor(
    public readonly street: string,
    public readonly number: string,
    public readonly neighborhood: string,
    public readonly city: string,
    public readonly state: string,
    public readonly zipCode: string,
    public readonly complement?: string
  ) {}

  toString(): string {
    return `${this.street}, ${this.number} - ${this.neighborhood}, ${this.city}/${this.state}`;
  }
}
