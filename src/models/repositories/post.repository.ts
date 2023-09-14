import * as Type from "../../types/type";
import { PostEntity } from "../entities/post.entity";
import { AppDataSource } from "../../loaders/dbLoader";
import { AppError, CommonError } from "../../types/AppError";

export const PostRepository = AppDataSource.getRepository(PostEntity).extend({
  async createPost(
    backtrackId: number,
    description: string,
    createdAt: string
  ) {
    try {
      const userData = this.create({
        backtrackId,
        description,
        createdAt,
      });

      await this.save(userData);
      return userData;
    } catch (error) {
      throw error;
    }
  },

  async getPost() {
    try {
      const allPosts = await this.find({});

      return allPosts;
    } catch (error) {
      throw error;
    }
  },

  async deletePostById(backtrackId: number) {
    try {
      const postData = await this.findOne({ where: { backtrackId } });

      if (!postData) {
        throw `Post with backtrackId ${backtrackId} not found`;
      }

      const userData = await this.remove(postData);

      return userData;
    } catch (error) {
      throw error;
    }
  },
});
