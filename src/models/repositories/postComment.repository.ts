import * as Type from "../../types/type";
import { postCommentEntity } from "../entities/p.comment.entity";
import { AppDataSource } from "../../loaders/dbLoader";
import { AppError, CommonError } from "../../types/AppError";
export const postCommentRepository = AppDataSource.getRepository(
  postCommentEntity
).extend({
  async createComment(
    userId: number,
    postId: number,
    comment: string,
    createdAt: string
  ) {
    try {
      const commentData = this.create({
        userId,
        postId,
        comment,
        createdAt,
      });

      await this.save(commentData);
      return commentData;
    } catch (error) {
      throw error;
    }
  },
  async getPostCommentsByPostId(postId: number) {
    try {
      const existingComments = await this.createQueryBuilder("post_comment")

        .leftJoinAndSelect("post_comment.nickname", "user")
        .where("post_comment.postId = :postId", { postId })
        .getMany();

      const commentsWithNicknames = existingComments.map((comment) => {
        return {
          ...comment,
          nickname: comment.nickname.nickname,
        };
      });

      return commentsWithNicknames;
    } catch (error) {
      throw error;
    }
  },
});
