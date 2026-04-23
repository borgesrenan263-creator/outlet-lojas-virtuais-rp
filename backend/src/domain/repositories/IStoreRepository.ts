import { Store } from '../entities/Store';

export interface IStoreRepository {
  findById(id: number): Promise<Store | null>;
  findByOwnerId(ownerId: number): Promise<Store | null>;
  findBySlug(slug: string): Promise<Store | null>;
  create(store: Store): Promise<Store>;
  update(store: Store): Promise<Store>;
  findAllOpen(): Promise<Store[]>;
}
