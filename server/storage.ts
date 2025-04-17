import { 
  wireTypes, 
  type WireType, 
  type InsertWireType
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  getWireTypes(): Promise<WireType[]>;
  getWireType(id: number): Promise<WireType | undefined>;
  createWireType(wireType: InsertWireType): Promise<WireType>;
  updateWireType(id: number, wireType: WireType): Promise<WireType>;
  deleteWireType(id: number): Promise<boolean>;
  seedDefaultWireTypes(): Promise<void>;
}

export class MemStorage implements IStorage {
  private wireTypes: Map<string, Map<number, WireType>>;
  private currentIds: Map<string, number>;

  constructor() {
    this.wireTypes = new Map();
    this.currentIds = new Map();
  }

  private getUserStore(userId: string) {
    if (!this.wireTypes.has(userId)) {
      this.wireTypes.set(userId, new Map());
      this.currentIds.set(userId, 1);
    }
    return this.wireTypes.get(userId)!;
  }

  private getUserCurrentId(userId: string): number {
    return this.currentIds.get(userId) || 1;
  }

  private incrementUserCurrentId(userId: string): number {
    const nextId = this.getUserCurrentId(userId) + 1;
    this.currentIds.set(userId, nextId);
    return nextId;
  }

  async getWireTypes(userId: string): Promise<WireType[]> {
    return Array.from(this.getUserStore(userId).values());
  }

  async getWireType(userId: string, id: number): Promise<WireType | undefined> {
    return this.getUserStore(userId).get(id);
  }

  async createWireType(userId: string, insertWireType: InsertWireType): Promise<WireType> {
    const id = this.incrementUserCurrentId(userId);
    const wireType: WireType = { ...insertWireType, id };
    this.getUserStore(userId).set(id, wireType);
    return wireType;
  }

  async updateWireType(userId: string, id: number, wireType: WireType): Promise<WireType> {
    this.getUserStore(userId).set(id, wireType);
    return wireType;
  }

  async deleteWireType(userId: string, id: number): Promise<boolean> {
    return this.getUserStore(userId).delete(id);
  }

  async seedDefaultWireTypes(userId: string): Promise<void> {
    const store = this.getUserStore(userId);
    if (store.size === 0) {
      const defaultWireTypes: InsertWireType[] = [
        { name: "10/2 NM-B (Romex)", ratio: "13.0", isDefault: 1 },
        { name: "12/2 NM-B (Romex)", ratio: "8.46", isDefault: 1 },
        { name: "12/3 NM-B (Romex)", ratio: "11.2", isDefault: 1 },
        { name: "14/2 NM-B (Romex)", ratio: "5.84", isDefault: 1 },
        { name: "14/3 NM-B (Romex)", ratio: "7.7", isDefault: 1 },
        { name: "12/2 MC", ratio: "10.76", isDefault: 1 },
        { name: "10/2 UF-B", ratio: "14.0", isDefault: 1 },
        { name: "12/2 UF-B", ratio: "9.5", isDefault: 1 },
        { name: "14/2 UF-B", ratio: "7.275", isDefault: 1 },
        { name: "6/3 SER", ratio: "18.0", isDefault: 1 }
      ];

      for (const wireType of defaultWireTypes) {
        await this.createWireType(userId, wireType);
      }
    }
  }

  async seedDefaultWireTypes(): Promise<void> {
    // Only seed if there are no wire types yet
    if (this.wireTypes.size === 0) {
      const defaultWireTypes: InsertWireType[] = [
        { name: "10/2 NM-B (Romex)", ratio: 13.0, isDefault: 1 },
        { name: "12/2 NM-B (Romex)", ratio: 8.46, isDefault: 1 },
        { name: "12/3 NM-B (Romex)", ratio: 11.2, isDefault: 1 },
        { name: "14/2 NM-B (Romex)", ratio: 5.84, isDefault: 1 },
        { name: "14/3 NM-B (Romex)", ratio: 7.7, isDefault: 1 },
        { name: "12/2 MC", ratio: 10.76, isDefault: 1 }, // 26.9/250*100 = 10.76 lbs/100ft
        { name: "10/2 UF-B", ratio: 14.0, isDefault: 1 },
        { name: "12/2 UF-B", ratio: 9.5, isDefault: 1 },
        { name: "14/2 UF-B", ratio: 7.275, isDefault: 1 },
        { name: "6/3 SER", ratio: 18.0, isDefault: 1 }
      ];

      for (const wireType of defaultWireTypes) {
        await this.createWireType(wireType);
      }
    }
  }
}

export const storage = new MemStorage();
