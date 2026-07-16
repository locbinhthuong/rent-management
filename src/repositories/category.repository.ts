import Category, { ICategory } from '@/models/Category';

export class CategoryRepository {
  async findAll(): Promise<ICategory[]> {
    return Category.find().sort({ createdAt: -1 });
  }

  async findActive(): Promise<ICategory[]> {
    return Category.find({ isActive: true }).sort({ name: 1 });
  }

  async findById(id: string): Promise<ICategory | null> {
    return Category.findById(id);
  }

  async findBySlug(slug: string): Promise<ICategory | null> {
    return Category.findOne({ slug });
  }

  async create(data: Partial<ICategory>): Promise<ICategory> {
    const category = new Category(data);
    return category.save();
  }

  async update(id: string, data: Partial<ICategory>): Promise<ICategory | null> {
    return Category.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<ICategory | null> {
    return Category.findByIdAndDelete(id);
  }
}

export const categoryRepository = new CategoryRepository();
