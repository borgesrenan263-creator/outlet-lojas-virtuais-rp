export enum UserRole {
  CUSTOMER = 'customer',
  SELLER = 'seller',
  ADMIN = 'admin',
}

export class Role {
  constructor(public readonly value: UserRole) {}

  isSeller(): boolean {
    return this.value === UserRole.SELLER;
  }

  isAdmin(): boolean {
    return this.value === UserRole.ADMIN;
  }

  toString(): string {
    return this.value;
  }
}
