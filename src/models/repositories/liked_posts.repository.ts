import * as Type from "../../types/type";
import { LikedPostsEntity } from "../entities/liked_posts.entity";
import { AppDataSource } from "../../loaders/dbLoader";
import { AppError, CommonError } from "../../types/AppError";

export const LikedPostsRepository = AppDataSource.getRepository(
  LikedPostsEntity
).extend({
  async addLikeToPost(postId: number, userId: number) {
    try {
      const likedPostData = this.create({
        postId,
        userId,
      });

      await this.save(likedPostData);
      return likedPostData;
    } catch (error) {
      throw error;
    }
  },

  async getLikedPost(postId: number, userId: number) {
    try {
      const allPosts = await this.findOne({ where: { postId, userId } });

      return allPosts;
    } catch (error) {
      throw error;
    }
  },

  async deleteLikedPostById(id: number, userId: number) {
    try {
      const postData = await this.findOne({ where: { id, userId } });

      if (!postData) {
        throw `Post ${id} not found`;
      }

      const deletedData = await this.remove(postData);

      return deletedData;
    } catch (error) {
      throw error;
    }
  },
});
