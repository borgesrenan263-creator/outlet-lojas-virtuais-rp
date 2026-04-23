import { IUseCase } from '../../interfaces/IUseCase';
import { IStoreRepository } from '../../../domain/repositories/IStoreRepository';

export interface ListOpenStoresOutputItem {
  id: number;
  name: string;
  slug: string;
  logoUrl: string | null;
}

export class ListOpenStores implements IUseCase<void, ListOpenStoresOutputItem[]> {
  constructor(private storeRepository: IStoreRepository) {}

  async execute(): Promise<ListOpenStoresOutputItem[]> {
    const stores = await this.storeRepository.findAllOpen();
    return stores.map(store => ({
      id: store.id!,
      name: store.name,
      slug: store.slug,
      logoUrl: store.logoUrl,
    }));
  }
}
