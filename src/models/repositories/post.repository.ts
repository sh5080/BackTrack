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

  async updateBacktrackById(
    backtrackId: number,
    description: string,
    updatedAt: string
  ) {
    try {
      const userData = this.update(
        { id: backtrackId },
        { description, createdAt: updatedAt }
      );

      return userData;
    } catch (error) {
      throw error;
    }
  },
});
