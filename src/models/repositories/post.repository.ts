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
  async getOnePost(id: number) {
    try {
      const post = await this.findOne({ where: { id } });
      if (!post) {
        throw `Post ${id} not found`;
      }
      return post;
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

  // 좋아요 추가
  async addLikeToPost(username: string, id: number) {
    const connect = AppDataSource.createQueryRunner();
    await connect.connect();
    await connect.startTransaction();
    try {
      const user = await AuthRepository.findOne({
        where: { username },
      });
      const post = await PostRepository.findOne({
        where: { id },
      });
      if (!user || !post) {
        throw new AppError(
          CommonError.RESOURCE_NOT_FOUND,
          "사용자 또는 게시물을 찾을 수 없습니다.",
          404
        );
      }

      if (!user.likedPosts) {
        user.likedPosts = [];
      }

      if (!post.likedUsers) {
        post.likedUsers = [];
      }

      const alreadyLiked = user.likedPosts.includes(post.id);
      if (!alreadyLiked) {
        user.likedPosts.push(post.id);
        post.likedUsers.push(user.id);

        await AuthRepository.save(user);
        await PostRepository.save(post);
        return post;
      } else return null;
    } catch (error) {
      await connect.rollbackTransaction();
      await connect.release();
      throw error;
    }
  },

  // 좋아요 취소
  async removeLikeFromPost(username: string, id: number) {
    const connect = AppDataSource.createQueryRunner();
    await connect.connect();
    await connect.startTransaction();
    try {
      const user = await AuthRepository.findOne({
        where: { username },
      });
      const post = await PostRepository.findOne({
        where: { id },
      });

      if (!user || !post) {
        throw new AppError(
          CommonError.RESOURCE_NOT_FOUND,
          "사용자 또는 게시물을 찾을 수 없습니다.",
          404
        );
      }
      const alreadyLiked = user.likedPosts.includes(post.id);
      if (alreadyLiked) {
        user.likedPosts = user.likedPosts.filter(
          (likedPost) => likedPost !== post.id
        );
        post.likedUsers = post.likedUsers.filter(
          (likedUser) => likedUser !== user.id
        );
        await AuthRepository.save(user);
        await PostRepository.save(post);
        return post;
      } else return null;
    } catch (error) {
      await connect.rollbackTransaction();
      await connect.release();
      throw error;
    }
  },
});
