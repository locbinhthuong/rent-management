import Amenity, { IAmenity } from '@/models/Amenity';

export class AmenityRepository {
  async findAll(): Promise<IAmenity[]> {
    return Amenity.find().sort({ createdAt: -1 });
  }

  async findActive(): Promise<IAmenity[]> {
    return Amenity.find({ isActive: true }).sort({ name: 1 });
  }

  async findById(id: string): Promise<IAmenity | null> {
    return Amenity.findById(id);
  }

  async findByName(name: string): Promise<IAmenity | null> {
    return Amenity.findOne({ name });
  }

  async create(data: Partial<IAmenity>): Promise<IAmenity> {
    const amenity = new Amenity(data);
    return amenity.save();
  }

  async update(id: string, data: Partial<IAmenity>): Promise<IAmenity | null> {
    return Amenity.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<IAmenity | null> {
    return Amenity.findByIdAndDelete(id);
  }
}

export const amenityRepository = new AmenityRepository();
