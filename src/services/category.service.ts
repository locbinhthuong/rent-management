import { categoryRepository } from '@/repositories/category.repository';
import { ICategory } from '@/models/Category';

// Helper function to create a simple slug from name
const generateSlug = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD') // remove diacritics
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

export class CategoryService {
  async getAllCategories() {
    return categoryRepository.findAll();
  }

  async getActiveCategories() {
    return categoryRepository.findActive();
  }

  async createCategory(data: Partial<ICategory>) {
    if (!data.name) throw new Error('Category name is required');
    
    // Auto-generate slug if not provided
    const slug = data.slug || generateSlug(data.name);
    
    // Check if slug exists
    const existing = await categoryRepository.findBySlug(slug);
    if (existing) {
      throw new Error('Category with this slug already exists');
    }

    return categoryRepository.create({ ...data, slug });
  }

  async updateCategory(id: string, data: Partial<ICategory>) {
    if (data.name && !data.slug) {
      data.slug = generateSlug(data.name);
    }
    
    if (data.slug) {
      const existing = await categoryRepository.findBySlug(data.slug);
      if (existing && existing._id.toString() !== id) {
        throw new Error('Another category with this slug already exists');
      }
    }

    return categoryRepository.update(id, data);
  }

  async deleteCategory(id: string) {
    return categoryRepository.delete(id);
  }
}

export const categoryService = new CategoryService();
