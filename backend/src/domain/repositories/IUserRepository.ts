import { User } from '../entities/User';
import { Email } from '../value-objects/Email';

export interface IUserRepository {
  findById(id: number): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  create(user: User): Promise<User>;
  update(user: User): Promise<User>;
  delete(id: number): Promise<void>;
}
