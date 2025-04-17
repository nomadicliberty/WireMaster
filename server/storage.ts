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
  deleteWireType(id: number): Promise<boolean>;
  seedDefaultWireTypes(): Promise<void>;
}

export class MemStorage implements IStorage {
  private wireTypes: Map<number, WireType>;
  currentId: number;

  constructor() {
    this.wireTypes = new Map();
    this.currentId = 1;
  }

  async getWireTypes(): Promise<WireType[]> {
    return Array.from(this.wireTypes.values());
  }

  async getWireType(id: number): Promise<WireType | undefined> {
    return this.wireTypes.get(id);
  }

  async createWireType(insertWireType: InsertWireType): Promise<WireType> {
    const id = this.currentId++;
    const wireType: WireType = { ...insertWireType, id };
    this.wireTypes.set(id, wireType);
    return wireType;
  }

  async updateWireType(id: number, wireType: WireType): Promise<WireType> {
    this.wireTypes.set(id, wireType);
    return wireType;
  }

  async deleteWireType(id: number): Promise<boolean> {
    return this.wireTypes.delete(id);
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
