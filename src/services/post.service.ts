import Post, { IPost } from '@/models/Post';
import { generateSlug } from '@/utils/slug';

export class PostService {
  async createPost(data: Partial<IPost>) {
    if (data.title) {
      let baseSlug = generateSlug(data.title);
      let slug = baseSlug;
      let counter = 1;
      
      while (await Post.findOne({ slug })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      data.slug = slug;
    }
    
    const post = new Post(data);
    return post.save();
  }

  async getPostsByCtv(ctvId: string) {
    return Post.find({ ctv_id: ctvId }).sort({ createdAt: -1 });
  }

  async updatePost(id: string, data: Partial<IPost>) {
    return Post.findByIdAndUpdate(id, data, { new: true });
  }

  async getPostById(id: string) {
    return Post.findById(id);
  }
}

export const postService = new PostService();
