import { z } from 'zod';
import { AppError } from '../../shared/errors/errorHandler';
import bcrypt from 'bcrypt';

const passwordSchema = z.string().min(8).max(100);

export class Password {
  private readonly hashedValue: string;

  private constructor(hashedValue: string) {
    this.hashedValue = hashedValue;
  }

  static async create(plainPassword: string): Promise<Password> {
    const result = passwordSchema.safeParse(plainPassword);
    if (!result.success) {
      throw new AppError('Password must be 8-100 characters', 400);
    }
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(plainPassword, salt);
    return new Password(hash);
  }

  static fromHash(hash: string): Password {
    return new Password(hash);
  }

  async compare(plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, this.hashedValue);
  }

  getHash(): string {
    return this.hashedValue;
  }
}
