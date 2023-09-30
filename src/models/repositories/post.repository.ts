import * as Type from "../../types/type";
import { PostEntity } from "../entities/post.entity";
import { AppDataSource } from "../../loaders/dbLoader";
import { AppError, CommonError } from "../../types/AppError";
import { BacktrackRepository } from "./backtrack.repository";
import { AuthRepository } from "./auth.repository";
import { In } from "typeorm";

export const PostRepository = AppDataSource.getRepository(PostEntity).extend({
  async createPost(
    backtrackId: number,
    description: string,
    image: string,
    createdAt: string
  ) {
    try {
      const userData = this.create({
        backtrackId,
        description,
        image,
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
  async getMyPosts(ids: number[]) {
    try {
      // const posts = await this.find({
      //   where: { backtrackId: In(ids) },
      // });
      const posts = await this.createQueryBuilder("post")
        .innerJoinAndSelect("post.backtrack", "backtrack")
        .where("post.backtrackId IN (:...ids)", { ids })
        .getMany();

      return posts;
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
  async addLikeToPost(userId: number, id: number) {
    const connect = AppDataSource.createQueryRunner();
    await connect.connect();
    await connect.startTransaction();
    try {
      const user = await AuthRepository.findOne({
        where: { id: userId },
      });
      const post = await PostRepository.findOne({
        where: { id },
        relations: ["backtrack"],
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

      const alreadyLiked =
        user.likedPosts.includes(post.id) && post.likedUsers.includes(user.id);

      if (!alreadyLiked) {
        user.likedPosts = user.likedPosts.filter((id) => id !== post.id);
        post.likedUsers = post.likedUsers.filter((id) => id !== user.id);
        user.likedPosts.push(post.id);
        post.likedUsers.push(user.id);

        await AuthRepository.save(user);
        await PostRepository.save(post);

        const postAuthorId = post.backtrack?.userId;

        if (postAuthorId) {
          const postAuthor = await AuthRepository.findOne({
            where: { id: postAuthorId },
          });

          if (!postAuthor) {
            throw new AppError(
              CommonError.RESOURCE_NOT_FOUND,
              "백킹트랙에 해당하는 사용자를 찾을 수 없습니다.",
              404
            );
          }

          const postBacktracks = await BacktrackRepository.find({
            where: { userId: postAuthorId },
          });

          if (postBacktracks) {
            const totalLikes = await Promise.all(
              postBacktracks.map(async (backtrack) => {
                const posts = await PostRepository.find({
                  where: { backtrack: { id: backtrack.id } },
                });

                return posts.reduce(
                  (count, post) => count + (post.likedUsers?.length || 0),
                  0
                );
              })
            );

            const finalTotalLikes = totalLikes.reduce(
              (total, likes) => total + likes,
              0
            );

            postAuthor.totalLikes = finalTotalLikes;
            await AuthRepository.save(postAuthor);
          }
        }

        return post;
      } else return null;
    } catch (error) {
      await connect.rollbackTransaction();
      await connect.release();
      throw error;
    }
  },

  // 좋아요 취소
  async removeLikeFromPost(userId: number, id: number) {
    const connect = AppDataSource.createQueryRunner();
    await connect.connect();
    await connect.startTransaction();
    try {
      const user = await AuthRepository.findOne({
        where: { id: userId },
      });
      const post = await PostRepository.findOne({
        where: { id },
        relations: ["backtrack"],
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

        const postAuthorId = post.backtrack?.userId;

        const postAuthor = await AuthRepository.findOne({
          where: { id: postAuthorId },
        });
        const postBacktracks = await BacktrackRepository.find({
          where: { userId: postAuthorId },
        });

        if (!postAuthor) {
          throw new AppError(
            CommonError.RESOURCE_NOT_FOUND,
            "백킹트랙에 해당하는 사용자를 찾을 수 없습니다.",
            404
          );
        }

        if (postBacktracks) {
          const totalLikes = await Promise.all(
            postBacktracks.map(async (backtrack) => {
              const posts = await PostRepository.find({
                where: { backtrack: { id: backtrack.id } },
              });

              return posts.reduce(
                (count, post) => count + (post.likedUsers?.length || 0),
                0
              );
            })
          );

          const finalTotalLikes = totalLikes.reduce(
            (total, likes) => total + likes,
            0
          );

          postAuthor.totalLikes = finalTotalLikes;
          await AuthRepository.save(postAuthor);
        } else {
          throw new AppError(
            CommonError.RESOURCE_NOT_FOUND,
            "포스트에 해당하는 백킹트랙을 찾을 수 없습니다.",
            404
          );
        }

        return post;
      } else return null;
    } catch (error) {
      await connect.rollbackTransaction();
      await connect.release();
      throw error;
    }
  },
});
