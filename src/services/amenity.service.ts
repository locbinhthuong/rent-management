import { amenityRepository } from '@/repositories/amenity.repository';
import { IAmenity } from '@/models/Amenity';

export class AmenityService {
  async getAllAmenities() {
    return amenityRepository.findAll();
  }

  async getActiveAmenities() {
    return amenityRepository.findActive();
  }

  async createAmenity(data: Partial<IAmenity>) {
    if (!data.name) throw new Error('Amenity name is required');
    
    const existing = await amenityRepository.findByName(data.name);
    if (existing) {
      throw new Error('Amenity with this name already exists');
    }

    return amenityRepository.create(data);
  }

  async updateAmenity(id: string, data: Partial<IAmenity>) {
    if (data.name) {
      const existing = await amenityRepository.findByName(data.name);
      if (existing && existing._id.toString() !== id) {
        throw new Error('Another amenity with this name already exists');
      }
    }

    return amenityRepository.update(id, data);
  }

  async deleteAmenity(id: string) {
    return amenityRepository.delete(id);
  }
}

export const amenityService = new AmenityService();
