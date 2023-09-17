import * as Type from "../../types/type";
import { PostEntity } from "../entities/post.entity";
import { AppDataSource } from "../../loaders/dbLoader";
import { AppError, CommonError } from "../../types/AppError";
import { BacktrackRepository } from "./backtrack.repository";
import { AuthRepository } from "./auth.repository";

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

  async deletePostById(id: number) {
    try {
      const postData = await this.findOne({ where: { id } });

      if (!postData) {
        throw `Post ${id} not found`;
      }

      const userData = await this.remove(postData);

      return userData;
    } catch (error) {
      throw error;
    }
  },

  async addLikeToPost(username: string, id: number) {
    const connect = AppDataSource.createQueryRunner();
    await connect.connect();
    await connect.startTransaction();
    try {
      console.log("Transaction started");
      const post = await this.findOne({ where: { id: id } });
      if (!post) {
        throw new AppError(
          CommonError.RESOURCE_NOT_FOUND,
          "해당 게시물을 찾을 수 없습니다.",
          404
        );
      }

      const backtrack = await BacktrackRepository.getBacktrackDetail(
        post.backtrackId
      );

      if (!backtrack) {
        throw new AppError(
          CommonError.RESOURCE_NOT_FOUND,
          "해당 백트랙을 찾을 수 없습니다.",
          404
        );
      }

      const user = await AuthRepository.findOne({
        where: { username: username },
      });

      if (!user) {
        throw new AppError(
          CommonError.RESOURCE_NOT_FOUND,
          "해당 사용자를 찾을 수 없습니다.",
          404
        );
      }
      if (!user.likedPosts) {
        user.likedPosts = [];
      }

      const alreadyLiked = user.likedPosts.includes(post.id);
      if (!alreadyLiked) {
        await connect.commitTransaction();
        await connect.release();
        user.likedPosts.push(post.id);

        await AuthRepository.save(user);

        post.likesCount += 1;
        await this.save(post);
        console.log("Transaction committed");
        return post.likesCount;
      } else {
        return null;
      }
    } catch (error) {
      await connect.rollbackTransaction();
      await connect.release();
      throw error;
    }
  },
});
