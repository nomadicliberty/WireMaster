import { defaultWireTypes } from './defaultWireTypes';
import type { WireType } from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  getWireTypes(): Promise<WireType[]>;
  getWireType(id: string): Promise<WireType | undefined>;
  createWireType(wireType: InsertWireType): Promise<WireType>;
  updateWireType(id: string, wireType: WireType): Promise<WireType>;
  deleteWireType(id: string): Promise<boolean>;
  seedDefaultWireTypes(): Promise<void>;
}

// Dummy type to make this file standalone
// Replace or import your InsertWireType from @shared/schema if needed
export type InsertWireType = {
  name: string;
  ratio: number | string;
  isDefault?: number;
};

export class DatabaseStorage implements IStorage {
  private wireTypes: WireType[] = [...defaultWireTypes];

  async getWireTypes(): Promise<WireType[]> {
    return this.wireTypes;
  }

  async getWireType(id: string): Promise<WireType | undefined> {
    return this.wireTypes.find(wt => wt.id === id);
  }

  async createWireType(insertWireType: InsertWireType): Promise<WireType> {
    const newWireType: WireType = {
      ...insertWireType,
      id: crypto.randomUUID(),
      ratio: Number(insertWireType.ratio),
      isDefault: 0
    };
    this.wireTypes.push(newWireType);
    return newWireType;
  }

  async updateWireType(id: string, wireType: WireType): Promise<WireType> {
    const index = this.wireTypes.findIndex(wt => wt.id === id);
    if (index === -1) throw new Error("Wire type not found");
    this.wireTypes[index] = { ...this.wireTypes[index], ...wireType };
    return this.wireTypes[index];
  }

  async deleteWireType(id: string): Promise<boolean> {
    const index = this.wireTypes.findIndex(wt => wt.id === id);
    if (index === -1) return false;
    this.wireTypes.splice(index, 1);
    return true;
  }

  async seedDefaultWireTypes(): Promise<void> {
    // No-op: already using static seed
  }
}

export const storage = new DatabaseStorage();
