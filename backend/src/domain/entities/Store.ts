export class Store {
  constructor(
    public readonly id: number | null,
    public readonly ownerId: number,
    public name: string,
    public slug: string,
    public description: string | null,
    public logoUrl: string | null,
    public bannerUrl: string | null,
    public isOpen: boolean,
    public pixKey: string | null,
    public readonly createdAt: Date = new Date()
  ) {}

  close(): void {
    this.isOpen = false;
  }

  open(): void {
    this.isOpen = true;
  }

  updateInfo(data: { name?: string; description?: string; pixKey?: string }): void {
    if (data.name !== undefined) this.name = data.name;
    if (data.description !== undefined) this.description = data.description;
    if (data.pixKey !== undefined) this.pixKey = data.pixKey;
  }
}
