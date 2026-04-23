import { Repository } from 'typeorm';
import { AppDataSource } from '../connection';
import { UserModel } from '../models/UserModel';
import { User } from '../../../../domain/entities/User';
import { Email } from '../../../../domain/value-objects/Email';
import { Password } from '../../../../domain/value-objects/Password';
import { Role, UserRole } from '../../../../domain/value-objects/UserRole';
import { IUserRepository } from '../../../../domain/repositories/IUserRepository';

export class UserRepository implements IUserRepository {
  private repo: Repository<UserModel>;

  constructor() {
    this.repo = AppDataSource.getRepository(UserModel);
  }

  private toDomain(model: UserModel): User {
    return new User(
      model.id,
      new Email(model.email),
      Password.fromHash(model.passwordHash),
      model.name,
      model.phone ?? null,
      new Role(model.role as UserRole),
      model.createdAt
    );
  }

  async findById(id: number): Promise<User | null> {
    const model = await this.repo.findOneBy({ id });
    return model ? this.toDomain(model) : null;
  }

  async findByEmail(email: Email): Promise<User | null> {
    const model = await this.repo.findOneBy({ email: email.toString() });
    return model ? this.toDomain(model) : null;
  }

  async create(user: User): Promise<User> {
    const model = this.repo.create({
      name: user.name,
      email: user.email.toString(),
      passwordHash: user.getPasswordHash(),
      phone: user.phone ?? undefined,
      role: user.role.toString(),
    });
    const saved = await this.repo.save(model);
    return this.toDomain(saved);
  }

  async update(user: User): Promise<User> {
    await this.repo.update(user.id!, {
      name: user.name,
      phone: user.phone ?? undefined,
      passwordHash: user.getPasswordHash(),
    });
    const updated = await this.findById(user.id!);
    if (!updated) throw new Error('User not found after update');
    return updated;
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
