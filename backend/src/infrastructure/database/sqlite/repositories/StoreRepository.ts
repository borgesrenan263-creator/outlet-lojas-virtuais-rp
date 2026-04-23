import { Repository } from 'typeorm';
import { AppDataSource } from '../connection';
import { StoreModel } from '../models/StoreModel';
import { Store } from '../../../../domain/entities/Store';
import { IStoreRepository } from '../../../../domain/repositories/IStoreRepository';

export class StoreRepository implements IStoreRepository {
  private repo: Repository<StoreModel>;

  constructor() {
    this.repo = AppDataSource.getRepository(StoreModel);
  }

  private toDomain(model: StoreModel): Store {
    return new Store(
      model.id,
      model.ownerId,
      model.name,
      model.slug,
      model.description ?? null,
      model.logoUrl ?? null,
      model.bannerUrl ?? null,
      model.isOpen,
      model.pixKey ?? null,
      model.createdAt
    );
  }

  async findById(id: number): Promise<Store | null> {
    const model = await this.repo.findOneBy({ id });
    return model ? this.toDomain(model) : null;
  }

  async findByOwnerId(ownerId: number): Promise<Store | null> {
    const model = await this.repo.findOneBy({ ownerId });
    return model ? this.toDomain(model) : null;
  }

  async findBySlug(slug: string): Promise<Store | null> {
    const model = await this.repo.findOneBy({ slug });
    return model ? this.toDomain(model) : null;
  }

  async create(store: Store): Promise<Store> {
    const model = this.repo.create({
      ownerId: store.ownerId,
      name: store.name,
      slug: store.slug,
      description: store.description ?? undefined,
      logoUrl: store.logoUrl ?? undefined,
      bannerUrl: store.bannerUrl ?? undefined,
      isOpen: store.isOpen,
      pixKey: store.pixKey ?? undefined,
    });
    const saved = await this.repo.save(model);
    return this.toDomain(saved);
  }

  async update(store: Store): Promise<Store> {
    await this.repo.update(store.id!, {
      name: store.name,
      description: store.description ?? undefined,
      logoUrl: store.logoUrl ?? undefined,
      bannerUrl: store.bannerUrl ?? undefined,
      isOpen: store.isOpen,
      pixKey: store.pixKey ?? undefined,
    });
    const updated = await this.findById(store.id!);
    if (!updated) throw new Error('Store not found after update');
    return updated;
  }

  async findAllOpen(): Promise<Store[]> {
    const models = await this.repo.find({ where: { isOpen: true } });
    return models.map(m => this.toDomain(m));
  }
}
