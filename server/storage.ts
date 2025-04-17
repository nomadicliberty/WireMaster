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

  async deleteWireType(id: number): Promise<boolean> {
    const wireType = this.wireTypes.get(id);
    
    // Don't allow deletion of default wire types
    if (wireType && wireType.isDefault === 1) {
      return false;
    }
    
    return this.wireTypes.delete(id);
  }

  async seedDefaultWireTypes(): Promise<void> {
    // Only seed if there are no wire types yet
    if (this.wireTypes.size === 0) {
      const defaultWireTypes: InsertWireType[] = [
        { name: "12/2 NM-B (Romex)", ratio: 4.3, isDefault: 1 },
        { name: "14/2 NM-B (Romex)", ratio: 3.2, isDefault: 1 },
        { name: "12/3 NM-B (Romex)", ratio: 5.8, isDefault: 1 },
        { name: "10/2 NM-B (Romex)", ratio: 6.4, isDefault: 1 },
        { name: "6 AWG THHN Stranded", ratio: 7.5, isDefault: 1 },
        { name: "8 AWG THHN Stranded", ratio: 5.3, isDefault: 1 }
      ];

      for (const wireType of defaultWireTypes) {
        await this.createWireType(wireType);
      }
    }
  }
}

export const storage = new MemStorage();
