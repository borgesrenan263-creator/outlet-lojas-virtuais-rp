import { z } from 'zod';
import { AppError } from '../../shared/errors/errorHandler';

const emailSchema = z.string().email();

export class Email {
  private readonly value: string;

  constructor(email: string) {
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      throw new AppError('Invalid email format', 400);
    }
    this.value = email.toLowerCase();
  }

  toString(): string {
    return this.value;
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }
}
