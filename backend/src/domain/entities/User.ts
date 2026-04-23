import { Email } from '../value-objects/Email';
import { Password } from '../value-objects/Password';
import { Role, UserRole } from '../value-objects/UserRole';

export class User {
  constructor(
    public readonly id: number | null,
    public readonly email: Email,
    private password: Password,
    public name: string,
    public phone: string | null,
    public readonly role: Role,
    public readonly createdAt: Date = new Date()
  ) {}

  async validatePassword(plainPassword: string): Promise<boolean> {
    return this.password.compare(plainPassword);
  }

  getPasswordHash(): string {
    return this.password.getHash();
  }

  changePassword(newPassword: Password): void {
    this.password = newPassword;
  }

  isSeller(): boolean {
    return this.role.isSeller();
  }

  isAdmin(): boolean {
    return this.role.isAdmin();
  }
}
